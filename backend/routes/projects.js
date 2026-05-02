const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/projects — list projects for current user
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — create project
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('description').optional().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, description, color } = req.body;

      const project = await Project.create({
        name,
        description,
        color,
        createdBy: req.user._id,
        members: [{ user: req.user._id, role: 'admin' }]
      });

      await project.populate('members.user', 'name email');
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.user', 'name email')
      .populate('createdBy', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id — update project (admin only)
router.put('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Only admins can update the project.' });
    }

    const { name, description, color } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (color) project.color = color;

    await project.save();
    await project.populate('members.user', 'name email');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id — delete project (admin only)
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Only admins can delete the project.' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/members — add member (admin only)
router.post('/:id/members', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Only admins can add members.' });
    }

    const { email, role = 'member' } = req.body;
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found.' });

    if (project.isMember(userToAdd._id)) {
      return res.status(409).json({ message: 'User is already a member.' });
    }

    project.members.push({ user: userToAdd._id, role });
    await project.save();
    await project.populate('members.user', 'name email');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id/members/:userId — remove member (admin only)
router.delete('/:id/members/:userId', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Only admins can remove members.' });
    }

    const memberIndex = project.members.findIndex(
      m => m.user.toString() === req.params.userId
    );
    if (memberIndex === -1) return res.status(404).json({ message: 'Member not found.' });

    // Prevent removing the last admin
    const admins = project.members.filter(m => m.role === 'admin');
    if (admins.length === 1 && admins[0].user.toString() === req.params.userId) {
      return res.status(400).json({ message: 'Cannot remove the last admin.' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    await project.populate('members.user', 'name email');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
