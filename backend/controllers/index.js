/**
 * Main controllers index file
 * Exports all controller modules
 */

const revenueController = require('./revenueController');
const countriesController = require('./countriesController');
const customersController = require('./customersController');
const regionsController = require('./regionsController');
const analyticsController = require('./analyticsController');

module.exports = {
    revenueController,
    countriesController,
    customersController,
    regionsController,
    analyticsController
}; 