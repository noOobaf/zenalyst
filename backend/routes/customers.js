/**
 * Customers Routes
 * Defines customer-related API endpoints
 */

const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');
const { sanitizeQuery } = require('../middleware/validation');

/**
 * @swagger
 * /api/customers/concentration:
 *   get:
 *     summary: Get customer concentration analysis
 *     description: Retrieve customer concentration data sorted by total revenue
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of customers to return
 *     responses:
 *       200:
 *         description: Customer concentration data retrieved successfully
 */
router.get('/concentration', sanitizeQuery, customersController.getCustomerConcentration);

/**
 * @swagger
 * /api/customers/analysis:
 *   get:
 *     summary: Get customer analysis with filters
 *     description: Retrieve customer analysis data with filtering and pagination
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: minQ4Revenue
 *         schema:
 *           type: number
 *           default: 0
 *         description: Minimum Q4 revenue filter
 *       - in: query
 *         name: positiveGrowthOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filter for positive growth only
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Customer analysis data retrieved successfully
 */
router.get('/analysis', sanitizeQuery, customersController.getCustomerAnalysis);



/**
 * @swagger
 * /api/customers/statistics:
 *   get:
 *     summary: Get customer statistics
 *     description: Retrieve customer statistics and metrics
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customer statistics retrieved successfully
 */
router.get('/statistics', customersController.getCustomerStatistics);

/**
 * @swagger
 * /api/customers/{customerName}:
 *   get:
 *     summary: Get customer by name
 *     description: Retrieve specific customer data by name
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: customerName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the customer
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *       404:
 *         description: Customer not found
 */
router.get('/:customerName', customersController.getCustomerByName);

module.exports = router; 