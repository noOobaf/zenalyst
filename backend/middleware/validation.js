/**
 * Request validation middleware
 */

/**
 * Validate query parameters
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid query parameters',
                        details: error.details.map(detail => detail.message)
                    }
                });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Validate request body
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid request body',
                        details: error.details.map(detail => detail.message)
                    }
                });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Validate request parameters
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.params);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid request parameters',
                        details: error.details.map(detail => detail.message)
                    }
                });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Sanitize query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sanitizeQuery = (req, res, next) => {
    try {
        // Convert string numbers to actual numbers
        if (req.query.limit) {
            req.query.limit = parseInt(req.query.limit) || 10;
        }
        if (req.query.page) {
            req.query.page = parseInt(req.query.page) || 1;
        }
        if (req.query.minQ4Revenue) {
            req.query.minQ4Revenue = parseFloat(req.query.minQ4Revenue) || 0;
        }
        if (req.query.positiveGrowthOnly) {
            req.query.positiveGrowthOnly = req.query.positiveGrowthOnly === 'true';
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    validateQuery,
    validateBody,
    validateParams,
    sanitizeQuery
}; 