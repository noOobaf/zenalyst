/**
 * Analytics Service
 * Handles AI chat and analytics operations
 */

const { getCollection } = require('../database/connection');
const { transformData } = require('../utils/responseHandler');
const databaseConfig = require('../config/database');

/**
 * Pre-defined prompts for AI chat
 */
const PREDEFINED_PROMPTS = [
    {
        id: 1,
        title: "Revenue Growth Analysis",
        prompt: "Analyze the revenue growth patterns and identify top performing customers"
    },
    {
        id: 2,
        title: "Country Performance",
        prompt: "Which countries are showing the highest revenue growth and why?"
    },
    {
        id: 3,
        title: "Customer Concentration",
        prompt: "Analyze customer concentration and identify potential risks"
    },
    {
        id: 4,
        title: "Quarterly Trends",
        prompt: "What are the key trends in Q3 vs Q4 revenue performance?"
    },
    {
        id: 5,
        title: "Revenue Bridge Analysis",
        prompt: "Break down the revenue changes into expansion, new, and churned revenue"
    }
];

/**
 * Get predefined prompts
 * @returns {Promise<Array>} List of predefined prompts
 */
const getPredefinedPrompts = async () => {
    try {
        return PREDEFINED_PROMPTS;
    } catch (error) {
        console.error('Error in getPredefinedPrompts:', error);
        throw error;
    }
};

/**
 * Analyze data based on user prompt
 * @param {string} prompt - User's analysis prompt
 * @returns {Promise<Object>} Analysis results
 */
const analyzeData = async (prompt) => {
    try {
        const promptLower = prompt.toLowerCase();
        let analysis = {
            prompt,
            insights: [],
            recommendations: [],
            data: {}
        };

        // Revenue growth analysis
        if (promptLower.includes('revenue growth') || promptLower.includes('top performing')) {
            const revenueService = require('./revenueService');
            const topCustomers = await revenueService.getTopGrowthCustomers(5);
            
            analysis.insights.push(
                `Top 5 customers by revenue growth: ${topCustomers.map(c => c.customerName).join(', ')}`,
                `Highest growth customer: ${topCustomers[0]?.customerName} with ${topCustomers[0]?.formattedVariance} growth`
            );
            
            analysis.data.topCustomers = topCustomers;
        }

        // Country performance analysis
        if (promptLower.includes('country') || promptLower.includes('countries')) {
            const countriesService = require('./countriesService');
            const topCountries = await countriesService.getTopCountriesByRevenue(5);
            
            analysis.insights.push(
                `Top 5 countries by revenue: ${topCountries.map(c => c.countryName).join(', ')}`,
                `Highest revenue country: ${topCountries[0]?.countryName} with ${topCountries[0]?.formattedRevenue}`
            );
            
            analysis.data.topCountries = topCountries;
        }

        // Customer concentration analysis
        if (promptLower.includes('customer concentration') || promptLower.includes('risks')) {
            const customersService = require('./customersService');
            const concentration = await customersService.getCustomerConcentration(5);
            
            analysis.insights.push(
                `Top 5 customers by total revenue: ${concentration.map(c => c.customerName).join(', ')}`,
                `Customer concentration risk: ${concentration[0]?.customerName} represents significant portion of revenue`
            );
            
            analysis.data.concentration = concentration;
        }

        // Quarterly trends analysis
        if (promptLower.includes('quarterly') || promptLower.includes('q3') || promptLower.includes('q4')) {
            const revenueService = require('./revenueService');
            const summary = await revenueService.getRevenueSummary();
            
            const growthRate = summary.totalQ3Revenue > 0 ? 
                ((summary.totalQ4Revenue - summary.totalQ3Revenue) / summary.totalQ3Revenue) * 100 : 0;
            
            analysis.insights.push(
                `Q3 Revenue: ${summary.formattedQ3Revenue}`,
                `Q4 Revenue: ${summary.formattedQ4Revenue}`,
                `Overall growth: ${transformData.formatPercentage(growthRate)}`,
                `Variance: ${summary.formattedVariance}`
            );
            
            analysis.data.summary = summary;
        }

        // Revenue bridge analysis
        if (promptLower.includes('bridge') || promptLower.includes('expansion') || promptLower.includes('churned')) {
            const revenueService = require('./revenueService');
            const bridgeData = await revenueService.getRevenueBridgeData(5);
            
            const totalExpansion = bridgeData.reduce((sum, item) => sum + item.expansionRevenue, 0);
            const totalChurned = bridgeData.reduce((sum, item) => sum + item.churnedRevenue, 0);
            
            analysis.insights.push(
                `Top 5 customers by expansion revenue: ${bridgeData.map(c => c.customerName).join(', ')}`,
                `Total expansion revenue: ${transformData.formatCurrency(totalExpansion)}`,
                `Total churned revenue: ${transformData.formatCurrency(totalChurned)}`
            );
            
            analysis.data.bridgeData = bridgeData;
        }

        // Generate recommendations based on insights
        if (analysis.insights.length > 0) {
            analysis.recommendations.push(
                "Focus on high-growth customers to maximize revenue potential",
                "Monitor customer concentration to mitigate risks",
                "Analyze expansion opportunities in top-performing countries",
                "Implement strategies to reduce customer churn"
            );
        }

        return analysis;
    } catch (error) {
        console.error('Error in analyzeData:', error);
        throw error;
    }
};

/**
 * Get dashboard analytics summary
 * @returns {Promise<Object>} Dashboard analytics summary
 */
const getDashboardSummary = async () => {
    try {
        const revenueService = require('./revenueService');
        const countriesService = require('./countriesService');
        const customersService = require('./customersService');
        const regionsService = require('./regionsService');

        // Get all summary data
        const [revenueSummary, topCountries, customerStats, regionsSummary, topCustomers] = await Promise.all([
            revenueService.getRevenueSummary(),
            countriesService.getTopCountriesByRevenue(5),
            customersService.getCustomerStatistics(),
            regionsService.getRegionsSummary(),
            customersService.getCustomerConcentration(5)
        ]);

        return {
            revenue: revenueSummary,
            topCountries,
            topCustomers,
            customerStats,
            regions: regionsSummary,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error in getDashboardSummary:', error);
        throw error;
    }
};

module.exports = {
    getPredefinedPrompts,
    analyzeData,
    getDashboardSummary
}; 