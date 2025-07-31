/**
 * Revenue Routes
 * Defines revenue-related API endpoints
 */

const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');
const { sanitizeQuery } = require('../middleware/validation');

/**
 * @swagger
 * /api/revenue/summary:
 *   get:
 *     summary: Get revenue summary metrics
 *     description: Retrieve total Q3, Q4 revenue and variance metrics
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Revenue summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalQ3Revenue:
 *                       type: number
 *                     totalQ4Revenue:
 *                       type: number
 *                     totalVariance:
 *                       type: number
 */
router.get('/summary', revenueController.getRevenueSummary);

/**
 * @swagger
 * /api/revenue/quarterly:
 *   get:
 *     summary: Get quarterly revenue data
 *     description: Retrieve quarterly revenue trends and data
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Quarterly revenue data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quarter:
 *                         type: string
 *                       revenue:
 *                         type: number
 *                       formattedRevenue:
 *                         type: string
 */
router.get('/quarterly', revenueController.getQuarterlyRevenue);

/**
 * @swagger
 * /api/revenue/growth-customers:
 *   get:
 *     summary: Get top growth customers
 *     description: Retrieve top customers by revenue growth
 *     tags: [Revenue]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of customers to return
 *     responses:
 *       200:
 *         description: Top growth customers retrieved successfully
 */
router.get('/growth-customers', sanitizeQuery, revenueController.getTopGrowthCustomers);

/**
 * @swagger
 * /api/revenue/bridge:
 *   get:
 *     summary: Get revenue bridge data
 *     description: Retrieve revenue bridge and churned analysis data
 *     tags: [Revenue]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Revenue bridge data retrieved successfully
 */
router.get('/bridge', sanitizeQuery, revenueController.getRevenueBridgeData);

module.exports = router; 