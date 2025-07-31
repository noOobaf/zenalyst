/**
 * Countries Routes
 * Defines country-related API endpoints
 */

const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countriesController');
const { sanitizeQuery } = require('../middleware/validation');

/**
 * @swagger
 * /api/countries/top-revenue:
 *   get:
 *     summary: Get top countries by revenue
 *     description: Retrieve top countries sorted by yearly revenue
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of countries to return
 *     responses:
 *       200:
 *         description: Top countries by revenue retrieved successfully
 */
router.get('/top-revenue', sanitizeQuery, countriesController.getTopCountriesByRevenue);

/**
 * @swagger
 * /api/countries/revenue-share:
 *   get:
 *     summary: Get revenue share by country
 *     description: Retrieve revenue share data with percentages for pie chart
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Number of countries to include in pie chart
 *     responses:
 *       200:
 *         description: Revenue share by country retrieved successfully
 */
router.get('/revenue-share', sanitizeQuery, countriesController.getRevenueShareByCountry);

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all countries
 *     description: Retrieve all countries with revenue data
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: All countries retrieved successfully
 */
router.get('/', countriesController.getAllCountries);

/**
 * @swagger
 * /api/countries/{countryName}:
 *   get:
 *     summary: Get country by name
 *     description: Retrieve specific country data by name
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: countryName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the country
 *     responses:
 *       200:
 *         description: Country retrieved successfully
 *       404:
 *         description: Country not found
 */
router.get('/:countryName', countriesController.getCountryByName);

module.exports = router; 