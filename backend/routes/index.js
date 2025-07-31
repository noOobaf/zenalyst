/**
 * Main routes index file
 * Combines all route modules
 */

const express = require('express');
const router = express.Router();

// Import route modules
const revenueRoutes = require('./revenue');
const countriesRoutes = require('./countries');
const customersRoutes = require('./customers');
const regionsRoutes = require('./regions');
const analyticsRoutes = require('./analytics');

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Mount route modules
router.use('/revenue', revenueRoutes);
router.use('/countries', countriesRoutes);
router.use('/customers', customersRoutes);
router.use('/regions', regionsRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router; 