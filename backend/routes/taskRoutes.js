const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

/**
 * GET /api/tasks
 * Get all tasks with optional filtering and caching
 */
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in-progress, completed, blocked]
 *         description: Filter by status
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: Filter by assignee name
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 cached:
 *                   type: boolean
 */
router.get('/', taskController.getAllTasks);

/**
 * GET /api/tasks/stats
 * Get task statistics with caching
 */
/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TaskStats'
 *                 cached:
 *                   type: boolean
 */
router.get('/stats', taskController.getTaskStats);

/**
 * GET /api/tasks/overview
 * Get overview data for dashboard
 */
router.get('/overview', taskController.getOverviewData);

/**
 * GET /api/tasks/:id
 * Get single task by ID
 */
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', taskController.getTaskById);

/**
 * POST /api/tasks
 * Create new task
 */
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.post('/', taskController.createTask);

/**
 * PUT /api/tasks/:id
 * Update task
 */
router.put('/:id', taskController.updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
