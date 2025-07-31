/**
 * Revenue Controller
 * Handles revenue-related API endpoints
 */

const revenueService = require('../services/revenueService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get revenue summary
 * @route GET /api/revenue/summary
 */
const getRevenueSummary = asyncHandler(async (req, res) => {
    try {
        const summary = await revenueService.getRevenueSummary();
        successResponse(res, 200, 'Revenue summary retrieved successfully', summary);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve revenue summary', error.message);
    }
});

/**
 * Get quarterly revenue data
 * @route GET /api/revenue/quarterly
 */
const getQuarterlyRevenue = asyncHandler(async (req, res) => {
    try {
        const quarterlyData = await revenueService.getQuarterlyRevenue();
        successResponse(res, 200, 'Quarterly revenue data retrieved successfully', quarterlyData);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve quarterly revenue data', error.message);
    }
});

/**
 * Get top growth customers
 * @route GET /api/revenue/growth-customers
 */
const getTopGrowthCustomers = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const customers = await revenueService.getTopGrowthCustomers(limit);
        successResponse(res, 200, 'Top growth customers retrieved successfully', customers);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve top growth customers', error.message);
    }
});

/**
 * Get customer quarterly data with filters
 * @route GET /api/customers/quarterly-data
 */
const getCustomerQuarterlyData = asyncHandler(async (req, res) => {
    try {
        const filters = {
            minQ4Revenue: parseFloat(req.query.minQ4Revenue) || 0,
            positiveGrowthOnly: req.query.positiveGrowthOnly === 'true',
            limit: parseInt(req.query.limit) || 50,
            page: parseInt(req.query.page) || 1
        };

        const result = await revenueService.getCustomerQuarterlyData(filters);
        paginatedResponse(res, result.customers, result.pagination.currentPage, result.pagination.itemsPerPage, result.pagination.totalItems, 'Customer quarterly data retrieved successfully');
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve customer quarterly data', error.message);
    }
});

/**
 * Get revenue bridge data
 * @route GET /api/revenue/bridge
 */
const getRevenueBridgeData = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const data = await revenueService.getRevenueBridgeData(limit);
        successResponse(res, 200, 'Revenue bridge data retrieved successfully', data);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve revenue bridge data', error.message);
    }
});

module.exports = {
    getRevenueSummary,
    getQuarterlyRevenue,
    getTopGrowthCustomers,
    getCustomerQuarterlyData,
    getRevenueBridgeData
}; 