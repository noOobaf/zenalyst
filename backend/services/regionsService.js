/**
 * Regions Service
 * Handles region-wise revenue data operations
 */

const { getCollection } = require('../database/connection');
const { transformData } = require('../utils/responseHandler');
const databaseConfig = require('../config/database');

/**
 * Get all regions with revenue data
 * @returns {Promise<Array>} All regions data
 */
const getAllRegions = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.regions);
        
        const regions = await collection
            .find({})
            .sort({ "Yearly Revenue": -1 })
            .toArray();

        return regions.map(region => ({
            regionName: region.Region,
            yearlyRevenue: region['Yearly Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(region['Yearly Revenue'] || 0)
        }));
    } catch (error) {
        console.error('Error in getAllRegions:', error);
        throw error;
    }
};

/**
 * Get region by name
 * @param {string} regionName - Name of the region
 * @returns {Promise<Object>} Region data
 */
const getRegionByName = async (regionName) => {
    try {
        const collection = await getCollection(databaseConfig.collections.regions);
        
        const region = await collection.findOne({ Region: regionName });
        
        if (!region) {
            throw new Error(`Region '${regionName}' not found`);
        }

        return {
            regionName: region.Region,
            yearlyRevenue: region['Yearly Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(region['Yearly Revenue'] || 0)
        };
    } catch (error) {
        console.error('Error in getRegionByName:', error);
        throw error;
    }
};

/**
 * Get regions revenue summary
 * @returns {Promise<Object>} Regions revenue summary
 */
const getRegionsSummary = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.regions);
        
        const regions = await collection.find({}).toArray();
        
        const totalRevenue = regions.reduce((sum, region) => {
            return sum + (region['Yearly Revenue'] || 0);
        }, 0);

        const regionsWithData = regions.filter(region => region['Yearly Revenue'] !== null);

        return {
            totalRegions: regions.length,
            regionsWithData: regionsWithData.length,
            totalRevenue,
            formattedTotalRevenue: transformData.formatCurrency(totalRevenue),
            regions: regions.map(region => ({
                regionName: region.Region,
                revenue: region['Yearly Revenue'] || 0,
                formattedRevenue: transformData.formatCurrency(region['Yearly Revenue'] || 0),
                percentage: totalRevenue > 0 ? ((region['Yearly Revenue'] || 0) / totalRevenue) * 100 : 0,
                formattedPercentage: transformData.formatPercentage(totalRevenue > 0 ? ((region['Yearly Revenue'] || 0) / totalRevenue) * 100 : 0)
            }))
        };
    } catch (error) {
        console.error('Error in getRegionsSummary:', error);
        throw error;
    }
};

module.exports = {
    getAllRegions,
    getRegionByName,
    getRegionsSummary
}; 