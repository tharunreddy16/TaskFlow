const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/dashboard/:projectId — project dashboard stats
router.get('/:projectId', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('members.user', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email');

    const now = new Date();

    // Status breakdown
    const statusCounts = { todo: 0, in_progress: 0, done: 0 };
    // Priority breakdown
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    // Overdue
    let overdueCount = 0;
    // Per-user task counts
    const userTaskMap = {};

    tasks.forEach(task => {
      statusCounts[task.status]++;
      priorityCounts[task.priority]++;

      if (task.dueDate && task.status !== 'done' && new Date(task.dueDate) < now) {
        overdueCount++;
      }

      if (task.assignedTo) {
        const uid = task.assignedTo._id.toString();
        if (!userTaskMap[uid]) {
          userTaskMap[uid] = {
            user: task.assignedTo,
            total: 0,
            todo: 0,
            in_progress: 0,
            done: 0
          };
        }
        userTaskMap[uid].total++;
        userTaskMap[uid][task.status]++;
      }
    });

    // Completion rate
    const completionRate = tasks.length
      ? Math.round((statusCounts.done / tasks.length) * 100)
      : 0;

    res.json({
      totalTasks: tasks.length,
      statusCounts,
      priorityCounts,
      overdueCount,
      completionRate,
      tasksByUser: Object.values(userTaskMap),
      memberCount: project.members.length
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard — overall stats across all user's projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id });
    const projectIds = projects.map(p => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } });
    const now = new Date();

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const overdueTasks = tasks.filter(
      t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now
    ).length;

    res.json({
      totalProjects: projects.length,
      totalTasks,
      doneTasks,
      overdueTasks,
      completionRate: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
