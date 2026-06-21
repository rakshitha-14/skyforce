const Task = require('../models/Task');
const Project = require('../models/Project');
const { createNotificationHelper } = require('./notificationController');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      tasks = await Task.find({}).populate('project', 'name').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks by project ID
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('project', 'name').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin, Manager)
const createTask = async (req, res) => {
  const { project, title, description, assignedTo, status, priority, dueDate, attachments } = req.body;

  try {
    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      project,
      title,
      description,
      assignedTo,
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate,
      attachments: attachments || [],
    });

    // Notify assignee
    if (assignedTo) {
      await createNotificationHelper(
        assignedTo,
        req.user._id,
        `You have been assigned a new task: "${title}"`,
        'Task_Assigned'
      );
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based authorization check
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      // Admins and Managers can update any field
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
      task.status = req.body.status || task.status;
      task.priority = req.body.priority || task.priority;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.attachments = req.body.attachments || task.attachments;
    } else {
      // Employees can only update task status or attachments, and only if assigned to them
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this task' });
      }
      
      if (req.body.status) {
        task.status = req.body.status;
      }
      if (req.body.attachments) {
        task.attachments = req.body.attachments;
      }
    }

    const updatedTask = await task.save();

    // Trigger Notification alerts based on update context
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      if (req.body.assignedTo) {
        await createNotificationHelper(
          req.body.assignedTo,
          req.user._id,
          `You have been assigned the task: "${updatedTask.title}"`,
          'Task_Assigned'
        );
      }
    } else {
      // Notify project manager of employee status update
      const projectDoc = await Project.findById(updatedTask.project);
      if (projectDoc) {
        await createNotificationHelper(
          projectDoc.manager,
          req.user._id,
          `Task "${updatedTask.title}" status updated to "${updatedTask.status}" by employee ${req.user.name}`,
          'Project_Update'
        );
      }
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin, Manager)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getMyTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};
