/**
 * Error handling middleware
 */

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;

        // Log error for debugging
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
        });

        // MongoDB duplicate key error
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new ApiError(400, message);
        }

        // MongoDB validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new ApiError(400, message);
        }

        // MongoDB cast error
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new ApiError(404, message);
        }

        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid token';
            error = new ApiError(401, message);
        }

        if (err.name === 'TokenExpiredError') {
            const message = 'Token expired';
            error = new ApiError(401, message);
        }

        // Default error response
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';

        res.status(statusCode).json({
            success: false,
            error: {
                message,
                statusCode,
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            }
        });
    } catch (handlerError) {
        // Fallback error response
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal Server Error',
                statusCode: 500
            }
        });
    }
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    ApiError,
    notFound,
    errorHandler,
    asyncHandler
}; 