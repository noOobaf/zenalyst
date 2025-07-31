/**
 * Regions Routes
 * Defines region-related API endpoints
 */

const express = require('express');
const router = express.Router();
const regionsController = require('../controllers/regionsController');

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Get all regions
 *     description: Retrieve all regions with revenue data
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: All regions retrieved successfully
 */
router.get('/', regionsController.getAllRegions);

/**
 * @swagger
 * /api/regions/revenue:
 *   get:
 *     summary: Get regions revenue summary
 *     description: Retrieve regions revenue summary with percentages
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: Regions revenue summary retrieved successfully
 */
router.get('/revenue', regionsController.getRegionsRevenue);

/**
 * @swagger
 * /api/regions/{regionName}:
 *   get:
 *     summary: Get region by name
 *     description: Retrieve specific region data by name
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: regionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the region
 *     responses:
 *       200:
 *         description: Region retrieved successfully
 *       404:
 *         description: Region not found
 */
router.get('/:regionName', regionsController.getRegionByName);

module.exports = router; 