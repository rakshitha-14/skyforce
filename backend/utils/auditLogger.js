const AuditLog = require('../models/AuditLog');

/**
 * Helper to record an audit log in the database.
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g. "Created Project ABC")
 * @param {string} module - Component or module affected (e.g. "Projects")
 * @param {string} ipAddress - Client IP address
 */
const recordAuditLog = async (userId, action, module, ipAddress) => {
  try {
    await AuditLog.create({
      userId,
      action,
      module,
      ipAddress: ipAddress || '127.0.0.1',
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = { recordAuditLog };
