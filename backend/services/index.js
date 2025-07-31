/**
 * Main services index file
 * Exports all service modules
 */

const revenueService = require('./revenueService');
const countriesService = require('./countriesService');
const customersService = require('./customersService');
const regionsService = require('./regionsService');
const analyticsService = require('./analyticsService');

module.exports = {
    revenueService,
    countriesService,
    customersService,
    regionsService,
    analyticsService
}; 