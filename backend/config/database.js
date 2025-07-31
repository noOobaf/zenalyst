/**
 * Database configuration settings
 */
const databaseConfig = {
    // MongoDB connection settings
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        database: process.env.DB_NAME || 'zenalyst_analytics',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },

    // Collection names
    collections: {
        countries: 'countries',
        regions: 'regions',
        quarterlyRevenue: 'quarterly_revenue',
        revenueBridge: 'revenue_bridge',
        customerConcentration: 'customer_concentration',
        revenueSummary: 'revenue_summary'
    },

    // Index configurations
    indexes: {
        countries: [
            { key: { "Country": 1 } },
            { key: { "Yearly Revenue": -1 } }
        ],
        quarterlyRevenue: [
            { key: { "Customer Name": 1 } },
            { key: { "Variance": -1 } },
            { key: { "Percentage of Variance": -1 } }
        ],
        revenueBridge: [
            { key: { "Customer Name": 1 } },
            { key: { "Expansion Revenue": -1 } },
            { key: { "Churned Revenue": -1 } }
        ],
        customerConcentration: [
            { key: { "Customer Name": 1 } },
            { key: { "Total Revenue": -1 } }
        ],
        regions: [
            { key: { "Region": 1 } }
        ]
    }
};

module.exports = databaseConfig; 