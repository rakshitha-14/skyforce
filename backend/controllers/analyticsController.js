const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const DATA_DIR = path.join(__dirname, '../data');

// Helper to check if using mock db
const isUsingMockDb = () => {
  return mongoose.connection.readyState === 0;
};

// Helper for Mock DB JSON reader
const readJSON = (collectionName) => {
  const filepath = path.join(DATA_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filepath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
};

// Date range threshold helper
const getStartDateLimit = (range) => {
  const limit = new Date();
  if (range === '7d') {
    limit.setDate(limit.getDate() - 7);
  } else if (range === 'quarter') {
    limit.setDate(limit.getDate() - 90);
  } else { // default to 30d
    limit.setDate(limit.getDate() - 30);
  }
  return limit;
};

// @desc    Get real-time database aggregation metrics for charts
// @route   GET /api/analytics
// @access  Private (Admin, Manager)
const getAnalytics = async (req, res) => {
  const range = req.query.range || '30d';
  const startDate = getStartDateLimit(range);

  try {
    if (isUsingMockDb()) {
      // MOCK DB AGGREGATION PIPELINE
      return runMockAggregation(res, range, startDate);
    }

    // REAL MONGODB AGGREGATION PIPELINES

    // 1) Velocity (Projects grouping)
    const velocity = await Project.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // 2) Workload Distribution (Tasks grouped by employee & status)
    const workloadRaw = await Task.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            employeeId: "$assignedTo",
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Populate workload employee names
    const workload = [];
    for (let w of workloadRaw) {
      if (w._id.employeeId) {
        const emp = await User.findById(w._id.employeeId);
        workload.push({
          employee: emp ? emp.name : 'Unknown',
          status: w._id.status,
          count: w.count
        });
      }
    }

    // 3) Attendance rate & arrival peaks
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$date",
          presentCount: { $sum: 1 },
          avgCheckInTime: { $avg: { $hour: "$checkIn" } } // extract hour of day
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4) Task Priority Breakdown
    const priorities = await Task.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      velocity,
      workload,
      attendanceStats,
      priorities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Falling back to local Mock database aggregation
const runMockAggregation = (res, range, startDate) => {
  const projects = readJSON('projects');
  const tasks = readJSON('tasks');
  const attendances = readJSON('attendances');
  const users = readJSON('users');

  // Filter lists by date threshold
  const filterByDate = (items) => {
    return items.filter(item => new Date(item.createdAt || Date.now()) >= startDate);
  };

  const filteredProjects = filterByDate(projects);
  const filteredTasks = filterByDate(tasks);
  const filteredAttendances = filterByDate(attendances);

  // 1) Velocity: group project completions by month
  const velocityGroup = {};
  filteredProjects.forEach(p => {
    const month = new Date(p.createdAt || Date.now()).toLocaleString('default', { month: 'short' });
    if (!velocityGroup[month]) {
      velocityGroup[month] = { Planned: 0, Actual: 0 };
    }
    velocityGroup[month].Planned += 1;
    if (p.status === 'Completed') {
      velocityGroup[month].Actual += 1;
    }
  });
  
  const velocity = Object.keys(velocityGroup).map(month => ({
    name: month,
    Planned: velocityGroup[month].Planned,
    Actual: velocityGroup[month].Actual
  }));

  // 2) Workload: stacked states per employee
  const workloadGroup = {};
  filteredTasks.forEach(t => {
    if (!t.assignedTo) return;
    const emp = users.find(u => u._id === t.assignedTo.toString());
    const name = emp ? emp.name : 'Unknown';
    
    if (!workloadGroup[name]) {
      workloadGroup[name] = { name, 'To Do': 0, 'In Progress': 0, Completed: 0 };
    }
    if (t.status === 'Completed') {
      workloadGroup[name].Completed += 1;
    } else if (t.status === 'In Progress' || t.status === 'In Review') {
      workloadGroup[name]['In Progress'] += 1;
    } else {
      workloadGroup[name]['To Do'] += 1;
    }
  });
  const workload = Object.values(workloadGroup);

  // 3) Attendance & arrivals
  const attGroup = {};
  filteredAttendances.forEach(att => {
    const day = new Date(att.checkIn).toLocaleString('default', { weekday: 'short' });
    if (!attGroup[day]) {
      attGroup[day] = { name: day, checkins: 0, totalHours: 0 };
    }
    attGroup[day].checkins += 1;
    attGroup[day].totalHours += att.workHours || 0;
  });
  
  const attendanceStats = Object.values(attGroup).map(att => ({
    name: att.name,
    'Check-In Rate': Math.min(Math.round((att.checkins / Math.max(users.filter(u => u.role === 'Employee').length, 1)) * 100), 100),
    'Peak Hour': parseFloat((8.5 + (Math.random() * 1.5)).toFixed(1)) // mock average peak hour AM
  }));

  // 4) Task Priority distribution
  const priorityGroup = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  filteredTasks.forEach(t => {
    if (t.priority === 'High') priorityGroup.High += 1;
    else if (t.priority === 'Low') priorityGroup.Low += 1;
    else priorityGroup.Medium += 1; // default/medium
  });

  const priorities = Object.keys(priorityGroup).map(key => ({
    name: key,
    value: priorityGroup[key]
  }));

  res.json({
    velocity,
    workload,
    attendanceStats,
    priorities
  });
};

module.exports = {
  getAnalytics,
};
