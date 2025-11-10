const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

/**
 * GET /api/projects
 * Get all projects with caching
 */
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
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
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getProjectById);

router.post('/', projectController.createProject);

router.put('/:id', projectController.updateProject);

module.exports = router;
