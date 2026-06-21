const Project = require('../models/Project');
const Task = require('../models/Task');
const { recordAuditLog } = require('../utils/auditLogger');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      projects = await Project.find({}).populate('manager', 'name email');
    } else {
      // Find projects where user has assigned tasks
      const userTasks = await Task.find({ assignedTo: req.user._id });
      const projectIds = userTasks.map(task => task.project);
      projects = await Project.find({ _id: { $in: projectIds } }).populate('manager', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin, Manager)
const createProject = async (req, res) => {
  const { name, description, startDate, endDate, attachments } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      manager: req.user._id, // Managing user is the creator
      startDate,
      endDate,
      attachments: attachments || [],
    });

    // Record audit log
    await recordAuditLog(
      req.user._id,
      `Created project "${name}"`,
      'Projects',
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('manager', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Manager)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.startDate = req.body.startDate || project.startDate;
    project.endDate = req.body.endDate || project.endDate;
    project.status = req.body.status || project.status;
    project.attachments = req.body.attachments || project.attachments;

    if (req.body.manager) {
      project.manager = req.body.manager;
    }

    const updatedProject = await project.save();

    // Record audit log
    await recordAuditLog(
      req.user._id,
      `Updated project "${project.name}"`,
      'Projects',
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin, Manager)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete tasks belonging to this project first
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    
    // Record audit log
    await recordAuditLog(
      req.user._id,
      `Deleted project "${project.name}"`,
      'Projects',
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );

    res.json({ message: 'Project removed and associated tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
