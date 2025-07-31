const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'zenalyst_analytics';

let client = null;
let db = null;

/**
 * Get database connection
 * @returns {Promise<Object>} MongoDB database instance
 */
async function getDatabase() {
    try {
        if (!client || !client.topology || !client.topology.isConnected()) {
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db(DB_NAME);
            console.log('✅ Database connection established');
        }
        return db;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
}

/**
 * Close database connection
 */
async function closeDatabase() {
    try {
        if (client) {
            await client.close();
            client = null;
            db = null;
            console.log('🔌 Database connection closed');
        }
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
}

/**
 * Get collection by name
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Object>} MongoDB collection instance
 */
async function getCollection(collectionName) {
    try {
        const database = await getDatabase();
        return database.collection(collectionName);
    } catch (error) {
        console.error(`❌ Error getting collection ${collectionName}:`, error);
        throw error;
    }
}

module.exports = {
    getDatabase,
    getCollection,
    closeDatabase
}; 