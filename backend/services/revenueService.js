/**
 * Revenue Service
 * Handles all revenue-related data operations
 */

const { getCollection } = require('../database/connection');
const { transformData } = require('../utils/responseHandler');
const databaseConfig = require('../config/database');

/**
 * Get revenue summary metrics
 * @returns {Promise<Object>} Revenue summary data
 */
const getRevenueSummary = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.revenueSummary);
        const summary = await collection.findOne({});
        
        if (!summary) {
            throw new Error('Revenue summary not found');
        }

        return {
            totalQ3Revenue: summary.totalQ3Revenue,
            totalQ4Revenue: summary.totalQ4Revenue,
            totalVariance: summary.totalVariance,
            formattedQ3Revenue: transformData.formatCurrency(summary.totalQ3Revenue),
            formattedQ4Revenue: transformData.formatCurrency(summary.totalQ4Revenue),
            formattedVariance: transformData.formatCurrency(summary.totalVariance)
        };
    } catch (error) {
        console.error('Error in getRevenueSummary:', error);
        throw error;
    }
};

/**
 * Get quarterly revenue data
 * @returns {Promise<Array>} Quarterly revenue data
 */
const getQuarterlyRevenue = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.quarterlyRevenue);
        
        // Aggregate quarterly data
        const quarterlyData = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    q3Total: { $sum: { $ifNull: ['$Quarter 3 Revenue', 0] } },
                    q4Total: { $sum: { $ifNull: ['$Quarter 4 Revenue', 0] } }
                }
            }
        ]).toArray();

        if (quarterlyData.length === 0) {
            return [];
        }

        const data = quarterlyData[0];
        
        return [
            {
                quarter: 'Q3',
                revenue: data.q3Total,
                formattedRevenue: transformData.formatCurrency(data.q3Total)
            },
            {
                quarter: 'Q4',
                revenue: data.q4Total,
                formattedRevenue: transformData.formatCurrency(data.q4Total)
            }
        ];
    } catch (error) {
        console.error('Error in getQuarterlyRevenue:', error);
        throw error;
    }
};

/**
 * Get top customers by revenue growth
 * @param {number} limit - Number of customers to return
 * @returns {Promise<Array>} Top customers by growth
 */
const getTopGrowthCustomers = async (limit = 10) => {
    try {
        const collection = await getCollection(databaseConfig.collections.quarterlyRevenue);
        
        const customers = await collection
            .find({})
            .sort({ "Variance": -1 })
            .limit(limit)
            .toArray();

        return customers.map(customer => ({
            customerName: customer['Customer Name'],
            q3Revenue: customer['Quarter 3 Revenue'] || 0,
            q4Revenue: customer['Quarter 4 Revenue'] || 0,
            variance: customer['Variance'] || 0,
            percentageVariance: customer['Percentage of Variance'] || 0,
            formattedQ3Revenue: transformData.formatCurrency(customer['Quarter 3 Revenue'] || 0),
            formattedQ4Revenue: transformData.formatCurrency(customer['Quarter 4 Revenue'] || 0),
            formattedVariance: transformData.formatCurrency(customer['Variance'] || 0),
            formattedPercentage: transformData.formatPercentage(customer['Percentage of Variance'] || 0)
        }));
    } catch (error) {
        console.error('Error in getTopGrowthCustomers:', error);
        throw error;
    }
};

/**
 * Get customer quarterly data with filters
 * @param {Object} filters - Filter options
 * @param {number} filters.minQ4Revenue - Minimum Q4 revenue filter
 * @param {boolean} filters.positiveGrowthOnly - Filter for positive growth only
 * @param {number} filters.limit - Number of records to return
 * @param {number} filters.page - Page number for pagination
 * @returns {Promise<Object>} Paginated customer data
 */
const getCustomerQuarterlyData = async (filters = {}) => {
    try {
        const {
            minQ4Revenue = 0,
            positiveGrowthOnly = false,
            limit = 50,
            page = 1
        } = filters;

        const collection = await getCollection(databaseConfig.collections.quarterlyRevenue);
        
        // Build query filter
        let query = {};
        
        if (minQ4Revenue > 0) {
            query['Quarter 4 Revenue'] = { $gte: minQ4Revenue };
        }
        
        if (positiveGrowthOnly) {
            query['Variance'] = { $gt: 0 };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Get total count
        const total = await collection.countDocuments(query);

        // Get paginated data
        const customers = await collection
            .find(query)
            .sort({ "Variance": -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedCustomers = customers.map(customer => ({
            customerName: customer['Customer Name'],
            q3Revenue: customer['Quarter 3 Revenue'] || 0,
            q4Revenue: customer['Quarter 4 Revenue'] || 0,
            variance: customer['Variance'] || 0,
            percentageVariance: customer['Percentage of Variance'] || 0,
            formattedQ3Revenue: transformData.formatCurrency(customer['Quarter 3 Revenue'] || 0),
            formattedQ4Revenue: transformData.formatCurrency(customer['Quarter 4 Revenue'] || 0),
            formattedVariance: transformData.formatCurrency(customer['Variance'] || 0),
            formattedPercentage: transformData.formatPercentage(customer['Percentage of Variance'] || 0)
        }));

        return {
            customers: formattedCustomers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
    } catch (error) {
        console.error('Error in getCustomerQuarterlyData:', error);
        throw error;
    }
};

/**
 * Get revenue bridge data
 * @param {number} limit - Number of records to return
 * @returns {Promise<Array>} Revenue bridge data
 */
const getRevenueBridgeData = async (limit = 50) => {
    try {
        const collection = await getCollection(databaseConfig.collections.revenueBridge);
        
        // Aggregate the data by categories
        const aggregatedData = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    totalNewRevenue: { $sum: { $ifNull: ['$New Revenue', 0] } },
                    totalExpansionRevenue: { $sum: { $ifNull: ['$Expansion Revenue', 0] } },
                    totalChurnedRevenue: { $sum: { $ifNull: ['$Churned Revenue', 0] } },
                    totalContractionRevenue: { $sum: { $ifNull: ['$Contraction Revenue', 0] } }
                }
            }
        ]).toArray();

        if (aggregatedData.length === 0) {
            return [];
        }

        const data = aggregatedData[0];
        
        return [
            {
                category: 'New Revenue',
                amount: data.totalNewRevenue,
                formattedAmount: transformData.formatCurrency(data.totalNewRevenue),
                type: 'positive'
            },
            {
                category: 'Expansion Revenue',
                amount: data.totalExpansionRevenue,
                formattedAmount: transformData.formatCurrency(data.totalExpansionRevenue),
                type: 'positive'
            },
            {
                category: 'Churned Revenue',
                amount: Math.abs(data.totalChurnedRevenue),
                formattedAmount: transformData.formatCurrency(Math.abs(data.totalChurnedRevenue)),
                type: 'negative'
            },
            {
                category: 'Contraction Revenue',
                amount: Math.abs(data.totalContractionRevenue),
                formattedAmount: transformData.formatCurrency(Math.abs(data.totalContractionRevenue)),
                type: 'negative'
            }
        ];
    } catch (error) {
        console.error('Error in getRevenueBridgeData:', error);
        throw error;
    }
};

module.exports = {
    getRevenueSummary,
    getQuarterlyRevenue,
    getTopGrowthCustomers,
    getCustomerQuarterlyData,
    getRevenueBridgeData
}; 