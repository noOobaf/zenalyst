/**
 * Application configuration settings
 */
const appConfig = {
    // Server settings
    server: {
        port: process.env.PORT || 5000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development'
    },

    // API settings
    api: {
        version: process.env.API_VERSION || 'v1',
        prefix: process.env.API_PREFIX || '/api',
        baseUrl: process.env.BASE_URL || 'http://localhost:5000'
    },

    // CORS settings
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        message: 'Too many requests from this IP, please try again later.'
    },

    // Security settings
    security: {
        helmet: {
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        morgan: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    },

    // Swagger documentation
    swagger: {
        title: 'Zenalyst Analytics API',
        version: '1.0.0',
        description: 'REST API for Zenalyst Analytics Dashboard',
        contact: {
            name: 'Zenalyst Project'
        }
    }
};

module.exports = appConfig; 