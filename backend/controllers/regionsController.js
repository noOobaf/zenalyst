/**
 * Regions Controller
 * Handles region-related API endpoints
 */

const regionsService = require('../services/regionsService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get all regions
 * @route GET /api/regions
 */
const getAllRegions = asyncHandler(async (req, res) => {
    try {
        const regions = await regionsService.getAllRegions();
        successResponse(res, 200, 'All regions retrieved successfully', regions);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve regions', error.message);
    }
});

/**
 * Get region by name
 * @route GET /api/regions/:regionName
 */
const getRegionByName = asyncHandler(async (req, res) => {
    try {
        const { regionName } = req.params;
        const region = await regionsService.getRegionByName(regionName);
        successResponse(res, 200, 'Region retrieved successfully', region);
    } catch (error) {
        if (error.message.includes('not found')) {
            errorResponse(res, 404, 'Region not found', error.message);
        } else {
            errorResponse(res, 500, 'Failed to retrieve region', error.message);
        }
    }
});

/**
 * Get regions revenue summary
 * @route GET /api/regions/revenue
 */
const getRegionsRevenue = asyncHandler(async (req, res) => {
    try {
        const summary = await regionsService.getRegionsSummary();
        successResponse(res, 200, 'Regions revenue summary retrieved successfully', summary);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve regions revenue summary', error.message);
    }
});

module.exports = {
    getAllRegions,
    getRegionByName,
    getRegionsRevenue
}; 