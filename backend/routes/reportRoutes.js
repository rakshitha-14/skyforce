const express = require('express');
const router = express.Router();
const { generateEmployeeReport } = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/employee/:id', verifyToken, authorizeRoles('Admin', 'Manager'), generateEmployeeReport);

module.exports = router;
