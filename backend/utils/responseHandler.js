/**
 * Response handler utilities for consistent API responses
 */

/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    try {
        const response = {
            success: true,
            message,
            ...(data && { data })
        };

        res.status(statusCode).json(response);
    } catch (error) {
        console.error('Error in successResponse:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} error - Error details
 */
const errorResponse = (res, statusCode = 500, message = 'Internal server error', error = null) => {
    try {
        const response = {
            success: false,
            message,
            ...(error && { error })
        };

        res.status(statusCode).json(response);
    } catch (err) {
        console.error('Error in errorResponse:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Pagination response handler
 * @param {Object} res - Express response object
 * @param {Array} data - Response data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
    try {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const response = {
            success: true,
            message,
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in paginatedResponse:', error);
        errorResponse(res, 500, 'Error creating paginated response');
    }
};

/**
 * Data transformation utilities
 */
const transformData = {
    /**
     * Format currency values
     * @param {number} value - Numeric value
     * @returns {string} Formatted currency string
     */
    formatCurrency: (value) => {
        try {
            if (value === null || value === undefined) return '0.00';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } catch (error) {
            return '0.00';
        }
    },

    /**
     * Format percentage values
     * @param {number} value - Numeric value
     * @returns {string} Formatted percentage string
     */
    formatPercentage: (value) => {
        try {
            if (value === null || value === undefined) return '0.00%';
            return `${value.toFixed(2)}%`;
        } catch (error) {
            return '0.00%';
        }
    },

    /**
     * Round number to specified decimal places
     * @param {number} value - Numeric value
     * @param {number} decimals - Number of decimal places
     * @returns {number} Rounded number
     */
    roundToDecimals: (value, decimals = 2) => {
        try {
            if (value === null || value === undefined) return 0;
            return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        } catch (error) {
            return 0;
        }
    }
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    transformData
}; 