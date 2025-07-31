/**
 * Customers Service
 * Handles customer concentration and analysis data operations
 */

const { getCollection } = require('../database/connection');
const { transformData } = require('../utils/responseHandler');
const databaseConfig = require('../config/database');

/**
 * Get customer concentration analysis
 * @param {number} limit - Number of customers to return
 * @returns {Promise<Array>} Customer concentration data
 */
const getCustomerConcentration = async (limit = 20) => {
    try {
        const collection = await getCollection(databaseConfig.collections.customerConcentration);
        
        const customers = await collection
            .find({})
            .sort({ "Total Revenue": -1 })
            .limit(limit)
            .toArray();

        return customers.map(customer => ({
            customerName: customer['Customer Name'],
            totalRevenue: customer['Total Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(customer['Total Revenue'] || 0)
        }));
    } catch (error) {
        console.error('Error in getCustomerConcentration:', error);
        throw error;
    }
};

/**
 * Get customer analysis with detailed filters
 * @param {Object} filters - Filter options
 * @param {number} filters.minQ4Revenue - Minimum Q4 revenue filter
 * @param {boolean} filters.positiveGrowthOnly - Filter for positive growth only
 * @param {number} filters.limit - Number of records to return
 * @param {number} filters.page - Page number for pagination
 * @returns {Promise<Object>} Paginated customer analysis data
 */
const getCustomerAnalysis = async (filters = {}) => {
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
            .sort({ "Quarter 4 Revenue": -1 })
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
            formattedPercentage: transformData.formatPercentage(customer['Percentage of Variance'] || 0),
            growthStatus: (customer['Variance'] || 0) > 0 ? 'positive' : (customer['Variance'] || 0) < 0 ? 'negative' : 'neutral'
        }));

        return {
            customers: formattedCustomers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            },
            filters: {
                minQ4Revenue,
                positiveGrowthOnly
            }
        };
    } catch (error) {
        console.error('Error in getCustomerAnalysis:', error);
        throw error;
    }
};

/**
 * Get customer by name
 * @param {string} customerName - Name of the customer
 * @returns {Promise<Object>} Customer data
 */
const getCustomerByName = async (customerName) => {
    try {
        const collection = await getCollection(databaseConfig.collections.quarterlyRevenue);
        
        const customer = await collection.findOne({ "Customer Name": customerName });
        
        if (!customer) {
            throw new Error(`Customer '${customerName}' not found`);
        }

        return {
            customerName: customer['Customer Name'],
            q3Revenue: customer['Quarter 3 Revenue'] || 0,
            q4Revenue: customer['Quarter 4 Revenue'] || 0,
            variance: customer['Variance'] || 0,
            percentageVariance: customer['Percentage of Variance'] || 0,
            formattedQ3Revenue: transformData.formatCurrency(customer['Quarter 3 Revenue'] || 0),
            formattedQ4Revenue: transformData.formatCurrency(customer['Quarter 4 Revenue'] || 0),
            formattedVariance: transformData.formatCurrency(customer['Variance'] || 0),
            formattedPercentage: transformData.formatPercentage(customer['Percentage of Variance'] || 0)
        };
    } catch (error) {
        console.error('Error in getCustomerByName:', error);
        throw error;
    }
};

/**
 * Get customer statistics
 * @returns {Promise<Object>} Customer statistics
 */
const getCustomerStatistics = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.quarterlyRevenue);
        
        // Get all customers
        const allCustomers = await collection.find({}).toArray();
        
        // Calculate statistics
        const totalCustomers = allCustomers.length;
        const customersWithGrowth = allCustomers.filter(c => (c['Variance'] || 0) > 0).length;
        const customersWithDecline = allCustomers.filter(c => (c['Variance'] || 0) < 0).length;
        const customersNoChange = allCustomers.filter(c => (c['Variance'] || 0) === 0).length;
        
        const totalQ3Revenue = allCustomers.reduce((sum, c) => sum + (c['Quarter 3 Revenue'] || 0), 0);
        const totalQ4Revenue = allCustomers.reduce((sum, c) => sum + (c['Quarter 4 Revenue'] || 0), 0);
        
        return {
            totalCustomers,
            customersWithGrowth,
            customersWithDecline,
            customersNoChange,
            growthPercentage: totalCustomers > 0 ? (customersWithGrowth / totalCustomers) * 100 : 0,
            declinePercentage: totalCustomers > 0 ? (customersWithDecline / totalCustomers) * 100 : 0,
            noChangePercentage: totalCustomers > 0 ? (customersNoChange / totalCustomers) * 100 : 0,
            totalQ3Revenue,
            totalQ4Revenue,
            formattedTotalQ3Revenue: transformData.formatCurrency(totalQ3Revenue),
            formattedTotalQ4Revenue: transformData.formatCurrency(totalQ4Revenue)
        };
    } catch (error) {
        console.error('Error in getCustomerStatistics:', error);
        throw error;
    }
};

module.exports = {
    getCustomerConcentration,
    getCustomerAnalysis,
    getCustomerByName,
    getCustomerStatistics
}; 