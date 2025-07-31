/**
 * Main Server File
 * Sets up Express server with all middleware, routes, and Swagger documentation
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const appConfig = require('./config/app');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes');

// Create Express app
const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: appConfig.swagger.title,
            version: appConfig.swagger.version,
            description: appConfig.swagger.description,
            contact: appConfig.swagger.contact
        },
        servers: [
            {
                url: appConfig.api.baseUrl,
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: 'Error message'
                                },
                                statusCode: {
                                    type: 'integer',
                                    example: 500
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet(appConfig.security.helmet));

// CORS middleware
app.use(cors(appConfig.cors));

// Rate limiting
const limiter = rateLimit(appConfig.rateLimit);
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(appConfig.logging.morgan));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */

// Mount API routes
app.use(appConfig.api.prefix, routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = appConfig.server.port;
const HOST = appConfig.server.host;

app.listen(PORT, HOST, () => {
    console.log('🚀 Zenalyst Analytics API Server Started');
    console.log(`📊 Environment: ${appConfig.server.environment}`);
    console.log(`🌐 Server: http://${HOST}:${PORT}`);
    console.log(`📚 API Documentation: http://${HOST}:${PORT}/api-docs`);
    console.log(`🔗 Health Check: http://${HOST}:${PORT}${appConfig.api.prefix}/health`);
    console.log('✅ Server is ready to handle requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app; 