const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

/**
 * @swagger
 * /api/ai/summarize:
 *   post:
 *     summary: Generate AI-powered productivity summary
 *     tags: [AI Analytics]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forceRefresh:
 *                 type: boolean
 *                 description: Force refresh cached results
 *     responses:
 *       200:
 *         description: Productivity summary generated
 */
router.post('/summarize', aiController.summarizeProductivity);

/**
 * @swagger
 * /api/ai/query:
 *   post:
 *     summary: Ask AI natural language questions about team data
 *     tags: [AI Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: Who has closed the most tasks this week?
 *     responses:
 *       200:
 *         description: AI-generated answer
 */
router.post('/query', aiController.answerQuery);

/**
 * @swagger
 * /api/ai/predict:
 *   post:
 *     summary: Get AI sprint progress predictions
 *     tags: [AI Analytics]
 *     responses:
 *       200:
 *         description: Sprint prediction generated
 */
router.post('/predict', aiController.predictSprintProgress);

/**
 * @swagger
 * /api/ai/sentiment:
 *   post:
 *     summary: Analyze team sentiment from comments
 *     tags: [AI Analytics]
 *     responses:
 *       200:
 *         description: Sentiment analysis completed
 */
router.post('/sentiment', aiController.analyzeSentiment);

/**
 * @swagger
 * /api/ai/bottlenecks:
 *   post:
 *     summary: Identify workload bottlenecks
 *     tags: [AI Analytics]
 *     responses:
 *       200:
 *         description: Bottleneck analysis completed
 */
router.post('/bottlenecks', aiController.identifyBottlenecks);

/**
 * @swagger
 * /api/ai/daily-summary:
 *   post:
 *     summary: Generate daily performance summary
 *     tags: [AI Analytics]
 *     responses:
 *       200:
 *         description: Daily summary generated
 */
router.post('/daily-summary', aiController.generateDailySummary);

module.exports = router;
