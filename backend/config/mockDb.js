const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple JSON database helpers
const readJSON = (collectionName) => {
  const filepath = path.join(DATA_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
};

const writeJSON = (collectionName, data) => {
  const filepath = path.join(DATA_DIR, `${collectionName}.json`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

const mockConnect = () => {
  console.log('------------------------------------------------------------');
  console.log('⚠️  MongoDB Connection Refused! Local MongoDB server not running.');
  console.log('🤖 ENTERPRISE SYSTEM FALLBACK: ACTIVATING LOCAL JSON DATABASE MOCK.');
  console.log(`📂 Mock data will be stored as JSON files in: ${DATA_DIR}`);
  console.log('------------------------------------------------------------');

  // We will patch the Mongoose models dynamically to use JSON storage
  const models = ['User', 'Project', 'Task', 'Attendance', 'Notification', 'AuditLog'];
  
  models.forEach(modelName => {
    const collectionName = modelName.toLowerCase() + 's';

    // Mock Document prototype methods
    const makeMockDocument = (data) => {
      if (!data) return null;
      
      const doc = { ...data };
      
      doc.save = async function() {
        const items = readJSON(collectionName);
        const idx = items.findIndex(item => item._id === this._id);
        
        if (modelName === 'User' && this.password && !/^\$2[aby]\$/.test(this.password)) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }

        this.updatedAt = new Date().toISOString();

        if (idx !== -1) {
          items[idx] = { ...this };
        } else {
          items.push({ ...this });
        }
        writeJSON(collectionName, items);
        return this;
      };

      doc.deleteOne = async function() {
        const items = readJSON(collectionName);
        const filtered = items.filter(item => item._id !== this._id);
        writeJSON(collectionName, filtered);
        return this;
      };

      if (modelName === 'User') {
        doc.matchPassword = async function(enteredPassword) {
          const items = readJSON(collectionName);
          const matched = items.find(item => item._id === this._id);
          if (!matched) return false;
          return await bcrypt.compare(enteredPassword, matched.password);
        };
      }

      return doc;
    };

    // Helper for Mongoose-like Query chaining
    const makeQuery = (promiseFunc) => {
      const promise = Promise.resolve().then(promiseFunc);
      
      promise.populate = function() {
        return makeQuery(async () => {
          const result = await promise;
          if (!result) return null;
          
          const itemsToPopulate = Array.isArray(result) ? result : [result];
          
          for (let item of itemsToPopulate) {
            if (item.manager && modelName === 'Project') {
              const users = readJSON('users');
              item.manager = users.find(u => u._id === item.manager.toString()) || item.manager;
            }
            if (item.assignedTo && modelName === 'Task') {
              const users = readJSON('users');
              item.assignedTo = users.find(u => u._id === item.assignedTo.toString()) || item.assignedTo;
            }
            if (item.project && modelName === 'Task') {
              const projects = readJSON('projects');
              item.project = projects.find(p => p._id === item.project.toString()) || item.project;
            }
            if (item.user && modelName === 'Attendance') {
              const users = readJSON('users');
              item.user = users.find(u => u._id === item.user.toString()) || item.user;
            }
            if (item.recipient && modelName === 'Notification') {
              const users = readJSON('users');
              item.recipient = users.find(u => u._id === item.recipient.toString()) || item.recipient;
            }
            if (item.sender && modelName === 'Notification') {
              const users = readJSON('users');
              item.sender = users.find(u => u._id === item.sender.toString()) || item.sender;
            }
            if (item.userId && modelName === 'AuditLog') {
              const users = readJSON('users');
              item.userId = users.find(u => u._id === item.userId.toString()) || item.userId;
            }
          }
          return result;
        });
      };

      promise.select = function(fields) {
        return makeQuery(async () => {
          const result = await promise;
          if (!result) return null;
          
          if (fields === '+password') {
            return result;
          }
          
          const items = Array.isArray(result) ? result : [result];
          if (fields.includes('-password')) {
            items.forEach(item => { delete item.password; });
          }
          return result;
        });
      };

      promise.sort = function(sortObj) {
        return makeQuery(async () => {
          const result = await promise;
          if (!result || !Array.isArray(result)) return result;
          if (sortObj && sortObj.createdAt === -1) {
            return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
          return result;
        });
      };

      promise.skip = function(skipVal) {
        return makeQuery(async () => {
          const result = await promise;
          if (!result || !Array.isArray(result)) return result;
          return result.slice(skipVal);
        });
      };

      promise.limit = function(limitVal) {
        return makeQuery(async () => {
          const result = await promise;
          if (!result || !Array.isArray(result)) return result;
          return result.slice(0, limitVal);
        });
      };

      return promise;
    };

    // Override static methods
    let model;
    try {
      model = mongoose.model(modelName);
    } catch (e) {
      model = require(`../models/${modelName}`);
    }

    model.find = function(query = {}) {
      return makeQuery(() => {
        const items = readJSON(collectionName);
        const filtered = items.filter(item => {
          for (let key in query) {
            if (query[key] !== undefined) {
              if (typeof query[key] === 'object' && query[key] && query[key].$in) {
                const arr = query[key].$in.map(v => v.toString());
                if (!arr.includes(item[key]?.toString())) return false;
              } else if (item[key]?.toString() !== query[key]?.toString()) {
                return false;
              }
            }
          }
          return true;
        });
        return filtered.map(makeMockDocument);
      });
    };

    model.findOne = function(query = {}) {
      return makeQuery(async () => {
        const items = await model.find(query);
        return items[0] || null;
      });
    };

    model.findById = function(id) {
      return makeQuery(async () => {
        if (!id) return null;
        return await model.findOne({ _id: id.toString() });
      });
    };

    model.create = async function(docData) {
      const items = readJSON(collectionName);
      const newDoc = {
        _id: 'mock_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...docData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (modelName === 'User' && newDoc.password) {
        const salt = await bcrypt.genSalt(10);
        newDoc.password = await bcrypt.hash(newDoc.password, salt);
      }

      items.push(newDoc);
      writeJSON(collectionName, items);
      return makeMockDocument(newDoc);
    };

    model.deleteMany = async function(query = {}) {
      const items = readJSON(collectionName);
      const filtered = items.filter(item => {
        for (let key in query) {
          if (item[key]?.toString() === query[key]?.toString()) return false;
        }
        return true;
      });
      writeJSON(collectionName, filtered);
      return { deletedCount: items.length - filtered.length };
    };

    model.countDocuments = async function(query = {}) {
      const items = readJSON(collectionName);
      const filtered = items.filter(item => {
        for (let key in query) {
          if (item[key]?.toString() !== query[key]?.toString()) return false;
        }
        return true;
      });
      return filtered.length;
    };
  });
};

module.exports = { mockConnect };
