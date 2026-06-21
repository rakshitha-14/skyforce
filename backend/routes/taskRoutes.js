const express = require('express');
const router = express.Router();
const {
  getTasks,
  getMyTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(verifyToken, getTasks)
  .post(verifyToken, authorizeRoles('Admin', 'Manager'), createTask);

router.route('/my-tasks').get(verifyToken, getMyTasks);
router.route('/project/:projectId').get(verifyToken, getTasksByProject);

router
  .route('/:id')
  .put(verifyToken, updateTask)
  .delete(verifyToken, authorizeRoles('Admin', 'Manager'), deleteTask);

module.exports = router;
