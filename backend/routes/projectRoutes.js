const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(verifyToken, getProjects)
  .post(verifyToken, authorizeRoles('Admin', 'Manager'), createProject);

router
  .route('/:id')
  .get(verifyToken, getProjectById)
  .put(verifyToken, authorizeRoles('Admin', 'Manager'), updateProject)
  .delete(verifyToken, authorizeRoles('Admin', 'Manager'), deleteProject);

module.exports = router;
