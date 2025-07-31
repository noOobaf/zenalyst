/**
 * Analytics Controller
 * Handles AI chat and analytics API endpoints
 */

const analyticsService = require('../services/analyticsService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get predefined prompts
 * @route GET /api/chat/prompts
 */
const getPredefinedPrompts = asyncHandler(async (req, res) => {
    try {
        const prompts = await analyticsService.getPredefinedPrompts();
        successResponse(res, 200, 'Predefined prompts retrieved successfully', prompts);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve predefined prompts', error.message);
    }
});

/**
 * Analyze data based on user prompt
 * @route POST /api/chat/analyze
 */
const analyzeData = asyncHandler(async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt || typeof prompt !== 'string') {
            return errorResponse(res, 400, 'Invalid prompt provided');
        }

        const analysis = await analyticsService.analyzeData(prompt);
        successResponse(res, 200, 'Analysis completed successfully', analysis);
    } catch (error) {
        errorResponse(res, 500, 'Failed to analyze data', error.message);
    }
});

/**
 * Get dashboard summary
 * @route GET /api/analytics/dashboard
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
    try {
        const summary = await analyticsService.getDashboardSummary();
        successResponse(res, 200, 'Dashboard summary retrieved successfully', summary);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve dashboard summary', error.message);
    }
});

module.exports = {
    getPredefinedPrompts,
    analyzeData,
    getDashboardSummary
}; 