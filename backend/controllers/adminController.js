const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { recordAuditLog } = require('../utils/auditLogger');

// @desc    Get paginated audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalDocs = await AuditLog.countDocuments({});
    
    // Sort by descending date
    const logs = await AuditLog.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      docs: logs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for admin review
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a pending user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin only)
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isApproved) {
      return res.status(400).json({ message: 'User is already approved' });
    }

    user.isApproved = true;
    user.isRejected = false;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      isApproved: updatedUser.isApproved,
      isRejected: updatedUser.isRejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a pending user
// @route   PUT /api/admin/users/:id/reject
// @access  Private (Admin only)
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isApproved) {
      return res.status(400).json({ message: 'Cannot reject an already approved user' });
    }

    if (user.isRejected) {
      return res.status(400).json({ message: 'User is already rejected' });
    }

    user.isRejected = true;
    user.isApproved = false;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      isApproved: updatedUser.isApproved,
      isRejected: updatedUser.isRejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block a user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin only)
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'Admin') {
      return res.status(400).json({ message: 'Cannot block an Administrator' });
    }

    user.isBlocked = true;
    const updatedUser = await user.save();

    await recordAuditLog(req.user._id, `Blocked user: ${user.email}`, 'Admin Directory', req.ip);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      isApproved: updatedUser.isApproved,
      isBlocked: updatedUser.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unblock a user
// @route   PUT /api/admin/users/:id/unblock
// @access  Private (Admin only)
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false;
    const updatedUser = await user.save();

    await recordAuditLog(req.user._id, `Unblocked user: ${user.email}`, 'Admin Directory', req.ip);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      isApproved: updatedUser.isApproved,
      isBlocked: updatedUser.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuditLogs,
  getAllUsers,
  approveUser,
  rejectUser,
  blockUser,
  unblockUser,
};
