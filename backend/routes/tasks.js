const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/tasks?projectId=... — get tasks for a project
router.get('/', async (req, res, next) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;

    if (!projectId) return res.status(400).json({ message: 'projectId query param required.' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks — create task
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('projectId').notEmpty().withMessage('projectId required'),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['todo', 'in_progress', 'done']),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { title, description, status, priority, dueDate, projectId, assignedTo } = req.body;

      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found.' });
      if (!project.isMember(req.user._id)) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      // Only admins can create tasks
      if (!project.isAdmin(req.user._id)) {
        return res.status(403).json({ message: 'Only admins can create tasks.' });
      }

      // Validate assignedTo is a project member
      if (assignedTo && !project.isMember(assignedTo)) {
        return res.status(400).json({ message: 'Assigned user is not a project member.' });
      }

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        project: projectId,
        assignedTo: assignedTo || null,
        createdBy: req.user._id
      });

      await task.populate(['assignedTo', 'createdBy'].map(path => ({ path, select: 'name email' })));
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project._id);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id — update task
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const isAdmin = project.isAdmin(req.user._id);
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you.' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Members can only update status
    if (!isAdmin) {
      if (title || description || priority || dueDate || assignedTo) {
        return res.status(403).json({ message: 'Members can only update task status.' });
      }
      if (status) task.status = status;
    } else {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
      if (assignedTo !== undefined) {
        if (assignedTo && !project.isMember(assignedTo)) {
          return res.status(400).json({ message: 'Assigned user is not a project member.' });
        }
        task.assignedTo = assignedTo || null;
      }
    }

    await task.save();
    await task.populate(['assignedTo', 'createdBy'].map(path => ({ path, select: 'name email' })));
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id — admin only
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Only admins can delete tasks.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
