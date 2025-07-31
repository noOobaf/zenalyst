/**
 * Countries Controller
 * Handles country-related API endpoints
 */

const countriesService = require('../services/countriesService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get top countries by revenue
 * @route GET /api/countries/top-revenue
 */
const getTopCountriesByRevenue = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const countries = await countriesService.getTopCountriesByRevenue(limit);
        successResponse(res, 200, 'Top countries by revenue retrieved successfully', countries);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve top countries by revenue', error.message);
    }
});

/**
 * Get revenue share by country
 * @route GET /api/countries/revenue-share
 */
const getRevenueShareByCountry = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const countries = await countriesService.getRevenueShareByCountry(limit);
        successResponse(res, 200, 'Revenue share by country retrieved successfully', countries);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve revenue share by country', error.message);
    }
});

/**
 * Get all countries
 * @route GET /api/countries
 */
const getAllCountries = asyncHandler(async (req, res) => {
    try {
        const countries = await countriesService.getAllCountries();
        successResponse(res, 200, 'All countries retrieved successfully', countries);
    } catch (error) {
        errorResponse(res, 500, 'Failed to retrieve countries', error.message);
    }
});

/**
 * Get country by name
 * @route GET /api/countries/:countryName
 */
const getCountryByName = asyncHandler(async (req, res) => {
    try {
        const { countryName } = req.params;
        const country = await countriesService.getCountryByName(countryName);
        successResponse(res, 200, 'Country retrieved successfully', country);
    } catch (error) {
        if (error.message.includes('not found')) {
            errorResponse(res, 404, 'Country not found', error.message);
        } else {
            errorResponse(res, 500, 'Failed to retrieve country', error.message);
        }
    }
});

module.exports = {
    getTopCountriesByRevenue,
    getRevenueShareByCountry,
    getAllCountries,
    getCountryByName
}; 