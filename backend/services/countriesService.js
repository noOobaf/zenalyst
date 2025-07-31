/**
 * Countries Service
 * Handles country-wise revenue data operations
 */

const { getCollection } = require('../database/connection');
const { transformData } = require('../utils/responseHandler');
const databaseConfig = require('../config/database');

/**
 * Get top countries by revenue
 * @param {number} limit - Number of countries to return
 * @returns {Promise<Array>} Top countries by revenue
 */
const getTopCountriesByRevenue = async (limit = 10) => {
    try {
        const collection = await getCollection(databaseConfig.collections.countries);
        
        const countries = await collection
            .find({})
            .sort({ "Yearly Revenue": -1 })
            .limit(limit)
            .toArray();

        return countries.map(country => ({
            countryName: country.Country,
            yearlyRevenue: country['Yearly Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(country['Yearly Revenue'] || 0)
        }));
    } catch (error) {
        console.error('Error in getTopCountriesByRevenue:', error);
        throw error;
    }
};

/**
 * Get revenue share by country
 * @param {number} limit - Number of countries to return
 * @returns {Promise<Array>} Revenue share data with percentages
 */
const getRevenueShareByCountry = async (limit = 8) => {
    try {
        const collection = await getCollection(databaseConfig.collections.countries);
        
        // Get all countries
        const allCountries = await collection.find({}).toArray();
        
        // Calculate total revenue
        const totalRevenue = allCountries.reduce((sum, country) => {
            return sum + (country['Yearly Revenue'] || 0);
        }, 0);

        // Get top countries and calculate percentages
        const topCountries = allCountries
            .sort((a, b) => (b['Yearly Revenue'] || 0) - (a['Yearly Revenue'] || 0))
            .slice(0, limit);

        const result = topCountries.map(country => {
            const revenue = country['Yearly Revenue'] || 0;
            const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
            
            return {
                countryName: country.Country,
                revenue: revenue,
                percentage: transformData.roundToDecimals(percentage, 2),
                formattedRevenue: transformData.formatCurrency(revenue),
                formattedPercentage: transformData.formatPercentage(percentage)
            };
        });

        // Add "Others" category if there are more countries
        if (allCountries.length > limit) {
            const othersRevenue = allCountries
                .slice(limit)
                .reduce((sum, country) => sum + (country['Yearly Revenue'] || 0), 0);
            
            const othersPercentage = totalRevenue > 0 ? (othersRevenue / totalRevenue) * 100 : 0;
            
            result.push({
                countryName: 'Others',
                revenue: othersRevenue,
                percentage: transformData.roundToDecimals(othersPercentage, 2),
                formattedRevenue: transformData.formatCurrency(othersRevenue),
                formattedPercentage: transformData.formatPercentage(othersPercentage)
            });
        }

        return result;
    } catch (error) {
        console.error('Error in getRevenueShareByCountry:', error);
        throw error;
    }
};

/**
 * Get all countries with revenue data
 * @returns {Promise<Array>} All countries data
 */
const getAllCountries = async () => {
    try {
        const collection = await getCollection(databaseConfig.collections.countries);
        
        const countries = await collection
            .find({})
            .sort({ "Yearly Revenue": -1 })
            .toArray();

        return countries.map(country => ({
            countryName: country.Country,
            yearlyRevenue: country['Yearly Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(country['Yearly Revenue'] || 0)
        }));
    } catch (error) {
        console.error('Error in getAllCountries:', error);
        throw error;
    }
};

/**
 * Get country by name
 * @param {string} countryName - Name of the country
 * @returns {Promise<Object>} Country data
 */
const getCountryByName = async (countryName) => {
    try {
        const collection = await getCollection(databaseConfig.collections.countries);
        
        const country = await collection.findOne({ Country: countryName });
        
        if (!country) {
            throw new Error(`Country '${countryName}' not found`);
        }

        return {
            countryName: country.Country,
            yearlyRevenue: country['Yearly Revenue'] || 0,
            formattedRevenue: transformData.formatCurrency(country['Yearly Revenue'] || 0)
        };
    } catch (error) {
        console.error('Error in getCountryByName:', error);
        throw error;
    }
};

module.exports = {
    getTopCountriesByRevenue,
    getRevenueShareByCountry,
    getAllCountries,
    getCountryByName
}; 