const Attendance = require('../models/Attendance');

// Get YYYY-MM-DD string from date (local timezone)
const getLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Check-in today
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const todayStr = getLocalDateString(new Date());

    // Check if check-in already exists
    const existing = await Attendance.findOne({ user: req.user._id, date: todayStr });
    if (existing) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    const checkInTime = new Date();
    
    // Check if user is late (e.g. check-in after 09:30 AM local time)
    const cutoff = new Date();
    cutoff.setHours(9, 30, 0, 0);
    const status = checkInTime > cutoff ? 'Late' : 'Present';

    const attendance = await Attendance.create({
      user: req.user._id,
      date: todayStr,
      checkIn: checkInTime,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out today
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const todayStr = getLocalDateString(new Date());

    const attendance = await Attendance.findOne({ user: req.user._id, date: todayStr });
    if (!attendance) {
      return res.status(400).json({ message: 'Must check in first before checking out' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    attendance.checkOut = new Date();
    
    // Calculate work hours
    const diffMs = attendance.checkOut - attendance.checkIn;
    const diffHrs = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    attendance.workHours = diffHrs;

    const updated = await attendance.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/status
// @access  Private
const getTodayStatus = async (req, res) => {
  try {
    const todayStr = getLocalDateString(new Date());
    const attendance = await Attendance.findOne({ user: req.user._id, date: todayStr });
    
    res.json({
      checkedIn: !!attendance,
      checkedOut: !!(attendance && attendance.checkOut),
      record: attendance || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's attendance logs
// @route   GET /api/attendance/my-logs
// @access  Private
const getMyLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance logs (Admin/Manager only)
// @route   GET /api/attendance/all
// @access  Private (Admin, Manager)
const getAllLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({})
      .populate('user', 'name email department designation')
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyLogs,
  getAllLogs,
};
