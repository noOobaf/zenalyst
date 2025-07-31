/**
 * Customers Controller
 * Handles customer-related API endpoints
 */

const customersService = require('../services/customersService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get customer concentration analysis
 * @route GET /api/customers/concentration
 */
const getCustomerConcentration = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const customers = await customersService.getCustomerConcentration(limit);
        successResponse(res, 200, 'Customer concentration data retrieved successfully', customers);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve customer concentration data', error.message);
    }
});

/**
 * Get customer analysis with filters
 * @route GET /api/customers/analysis
 */
const getCustomerAnalysis = asyncHandler(async (req, res) => {
    try {
        const filters = {
            minQ4Revenue: parseFloat(req.query.minQ4Revenue) || 0,
            positiveGrowthOnly: req.query.positiveGrowthOnly === 'true',
            limit: parseInt(req.query.limit) || 50,
            page: parseInt(req.query.page) || 1
        };

        const result = await customersService.getCustomerAnalysis(filters);
        paginatedResponse(res, result.customers, result.pagination.currentPage, result.pagination.itemsPerPage, result.pagination.totalItems, 'Customer analysis data retrieved successfully');
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve customer analysis data', error.message);
    }
});

/**
 * Get customer by name
 * @route GET /api/customers/:customerName
 */
const getCustomerByName = asyncHandler(async (req, res) => {
    try {
        const { customerName } = req.params;
        const customer = await customersService.getCustomerByName(customerName);
        successResponse(res, 200, 'Customer retrieved successfully', customer);
    } catch (error) {
        if (error.message.includes('not found')) {
            errorResponse(res, 404, 'Customer not found', error.message);
        } else {
            errorResponse(res, 500, 'Failed to retrieve customer', error.message);
        }
    }
});

/**
 * Get customer statistics
 * @route GET /api/customers/statistics
 */
const getCustomerStatistics = asyncHandler(async (req, res) => {
    try {
        const statistics = await customersService.getCustomerStatistics();
        successResponse(res, 200, 'Customer statistics retrieved successfully', statistics);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve customer statistics', error.message);
    }
});

module.exports = {
    getCustomerConcentration,
    getCustomerAnalysis,
    getCustomerByName,
    getCustomerStatistics
}; 