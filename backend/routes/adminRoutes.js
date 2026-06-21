const express = require('express');
const router = express.Router();
const {
  getAuditLogs,
  getAllUsers,
  approveUser,
  rejectUser,
  blockUser,
  unblockUser,
} = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/audit-logs', verifyToken, authorizeRoles('Admin'), getAuditLogs);
router.get('/users', verifyToken, authorizeRoles('Admin'), getAllUsers);
router.put('/users/:id/approve', verifyToken, authorizeRoles('Admin'), approveUser);
router.put('/users/:id/reject', verifyToken, authorizeRoles('Admin'), rejectUser);
router.put('/users/:id/block', verifyToken, authorizeRoles('Admin'), blockUser);
router.put('/users/:id/unblock', verifyToken, authorizeRoles('Admin'), unblockUser);

module.exports = router;
