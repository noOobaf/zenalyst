/**
 * Analytics Routes
 * Defines AI chat and analytics API endpoints
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * @swagger
 * /api/analytics/prompts:
 *   get:
 *     summary: Get predefined prompts
 *     description: Retrieve list of predefined prompts for AI chat
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Predefined prompts retrieved successfully
 */
router.get('/prompts', analyticsController.getPredefinedPrompts);

/**
 * @swagger
 * /api/analytics/analyze:
 *   post:
 *     summary: Analyze data based on user prompt
 *     description: Analyze revenue data based on user's prompt
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: User's analysis prompt
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *       400:
 *         description: Invalid prompt provided
 */
router.post('/analyze', analyticsController.analyzeData);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     description: Retrieve comprehensive dashboard analytics summary
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 */
router.get('/dashboard', analyticsController.getDashboardSummary);

module.exports = router; 