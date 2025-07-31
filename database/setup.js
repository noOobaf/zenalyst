const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'zenalyst_analytics';

/**
 * Connect to MongoDB
 * @returns {Promise<Object>} MongoDB client and database instance
 */
async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB successfully');
        
        const db = client.db(DB_NAME);
        return { client, db };
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
}

/**
 * Read JSON file from Data Source directory
 * @param {string} filename - Name of the JSON file
 * @returns {Promise<Array>} Parsed JSON data
 */
async function readJsonFile(filename) {
    try {
        const filePath = path.join(__dirname, '..', 'Data Source', filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading ${filename}:`, error);
        throw error;
    }
}

/**
 * Create collections and insert data
 * @param {Object} db - MongoDB database instance
 */
async function setupCollections(db) {
    try {
        console.log('📊 Setting up database collections...');

        // Collection 1: Countries (from C._Country_wise_Revenue_Analysis.json)
        const countriesData = await readJsonFile('C._Country_wise_Revenue_Analysis.json');
        await db.collection('countries').deleteMany({});
        await db.collection('countries').insertMany(countriesData);
        console.log(`✅ Countries collection: ${countriesData.length} documents inserted`);

        // Collection 2: Regions (from D._Region_wise_Revenue_Analysis.json)
        const regionsData = await readJsonFile('D._Region_wise_Revenue_Analysis.json');
        await db.collection('regions').deleteMany({});
        await db.collection('regions').insertMany(regionsData);
        console.log(`✅ Regions collection: ${regionsData.length} documents inserted`);

        // Collection 3: Quarterly Revenue (from A._Quarterly_Revenue_and_QoQ_growth.json)
        const quarterlyData = await readJsonFile('A._Quarterly_Revenue_and_QoQ_growth.json');
        await db.collection('quarterly_revenue').deleteMany({});
        await db.collection('quarterly_revenue').insertMany(quarterlyData);
        console.log(`✅ Quarterly Revenue collection: ${quarterlyData.length} documents inserted`);

        // Collection 4: Revenue Bridge (from B._Revenue_Bridge_and_Churned_Analysis.json)
        const revenueBridgeData = await readJsonFile('B._Revenue_Bridge_and_Churned_Analysis.json');
        await db.collection('revenue_bridge').deleteMany({});
        await db.collection('revenue_bridge').insertMany(revenueBridgeData);
        console.log(`✅ Revenue Bridge collection: ${revenueBridgeData.length} documents inserted`);

        // Collection 5: Customer Concentration (from E._Customer_Concentration_Analysis.json)
        const customerData = await readJsonFile('E._Customer_Concentration_Analysis.json');
        await db.collection('customer_concentration').deleteMany({});
        await db.collection('customer_concentration').insertMany(customerData);
        console.log(`✅ Customer Concentration collection: ${customerData.length} documents inserted`);

        // Collection 6: Revenue Summary (calculated from quarterly data)
        await createRevenueSummary(db, quarterlyData);

        console.log('🎉 All collections setup completed successfully!');
    } catch (error) {
        console.error('❌ Error setting up collections:', error);
        throw error;
    }
}

/**
 * Create revenue summary collection with aggregated metrics
 * @param {Object} db - MongoDB database instance
 * @param {Array} quarterlyData - Quarterly revenue data
 */
async function createRevenueSummary(db, quarterlyData) {
    try {
        // Calculate total Q3 and Q4 revenue
        const totalQ3Revenue = quarterlyData.reduce((sum, item) => {
            return sum + (item['Quarter 3 Revenue'] || 0);
        }, 0);

        const totalQ4Revenue = quarterlyData.reduce((sum, item) => {
            return sum + (item['Quarter 4 Revenue'] || 0);
        }, 0);

        const totalVariance = totalQ4Revenue - totalQ3Revenue;

        const summaryData = {
            totalQ3Revenue: Math.round(totalQ3Revenue * 100) / 100,
            totalQ4Revenue: Math.round(totalQ4Revenue * 100) / 100,
            totalVariance: Math.round(totalVariance * 100) / 100,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.collection('revenue_summary').deleteMany({});
        await db.collection('revenue_summary').insertOne(summaryData);
        console.log('✅ Revenue Summary collection: 1 document inserted');
    } catch (error) {
        console.error('❌ Error creating revenue summary:', error);
        throw error;
    }
}

/**
 * Create database indexes for better query performance
 * @param {Object} db - MongoDB database instance
 */
async function createIndexes(db) {
    try {
        console.log('🔍 Creating database indexes...');

        // Indexes for countries collection
        await db.collection('countries').createIndex({ "Country": 1 });
        await db.collection('countries').createIndex({ "Yearly Revenue": -1 });

        // Indexes for quarterly revenue collection
        await db.collection('quarterly_revenue').createIndex({ "Customer Name": 1 });
        await db.collection('quarterly_revenue').createIndex({ "Variance": -1 });
        await db.collection('quarterly_revenue').createIndex({ "Percentage of Variance": -1 });

        // Indexes for revenue bridge collection
        await db.collection('revenue_bridge').createIndex({ "Customer Name": 1 });
        await db.collection('revenue_bridge').createIndex({ "Expansion Revenue": -1 });
        await db.collection('revenue_bridge').createIndex({ "Churned Revenue": -1 });

        // Indexes for customer concentration collection
        await db.collection('customer_concentration').createIndex({ "Customer Name": 1 });
        await db.collection('customer_concentration').createIndex({ "Total Revenue": -1 });

        // Indexes for regions collection
        await db.collection('regions').createIndex({ "Region": 1 });

        console.log('✅ Database indexes created successfully!');
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        throw error;
    }
}

/**
 * Main setup function
 */
async function setupDatabase() {
    let client;
    try {
        console.log('🚀 Starting database setup...');
        
        const { client: mongoClient, db } = await connectToDatabase();
        client = mongoClient;

        await setupCollections(db);
        await createIndexes(db);

        console.log('🎉 Database setup completed successfully!');
        console.log(`📊 Database: ${DB_NAME}`);
        console.log('📋 Collections created:');
        console.log('   - countries');
        console.log('   - regions');
        console.log('   - quarterly_revenue');
        console.log('   - revenue_bridge');
        console.log('   - customer_concentration');
        console.log('   - revenue_summary');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 MongoDB connection closed');
        }
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = {
    connectToDatabase,
    setupDatabase
}; 