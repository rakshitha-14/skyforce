const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyLogs,
  getAllLogs,
} = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/checkin', verifyToken, checkIn);
router.post('/checkout', verifyToken, checkOut);
router.get('/status', verifyToken, getTodayStatus);
router.get('/my-logs', verifyToken, getMyLogs);
router.get('/all', verifyToken, authorizeRoles('Admin', 'Manager'), getAllLogs);

module.exports = router;
