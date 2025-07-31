/**
 * Simple API Test Script
 * Run with: node test-apis.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const endpoints = [
    '/health',
    '/revenue/summary',
    '/revenue/quarterly',
    '/customers/concentration?limit=5',
    '/customers/statistics',
    '/countries?limit=5',
    '/regions',
    '/analytics/dashboard',
    '/analytics/metrics'
];

async function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`Testing: ${url}`);
        
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        console.log(`✅ ${endpoint} - Status: ${res.statusCode}`);
                    } else {
                        console.log(`❌ ${endpoint} - Error: ${response.message}`);
                    }
                } catch (e) {
                    console.log(`❌ ${endpoint} - Invalid JSON response`);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.log(`❌ ${endpoint} - Connection error: ${err.message}`);
            resolve();
        });
    });
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    
    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n✨ API Tests completed!');
    console.log('📖 For interactive testing, visit: http://localhost:5000/api-docs');
}

runTests(); 