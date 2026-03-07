/**
 * Simple in-memory rate limiter for authentication endpoints
 * In production, use Redis-backed rate limiting for distributed systems
 */

const rateLimit = new Map();

/**
 * Creates a rate limiting middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum requests allowed in window
 * @param {string} message - Error message to return
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 5, message = 'Too many requests') => {
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();

        // Clean up old entries
        const userRateData = rateLimit.get(key);

        if (!userRateData || now - userRateData.windowStart > windowMs) {
            // New window
            rateLimit.set(key, {
                windowStart: now,
                count: 1
            });
            return next();
        }

        if (userRateData.count >= maxRequests) {
            const retryAfter = Math.ceil((userRateData.windowStart + windowMs - now) / 1000);
            res.set('Retry-After', retryAfter);
            return res.status(429).json({
                error: 'Too Many Requests',
                message: message,
                retryAfter: retryAfter
            });
        }

        userRateData.count++;
        rateLimit.set(key, userRateData);
        next();
    };
};

// Pre-configured limiters for common use cases
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5,               // 5 attempts
    'Too many login attempts. Please try again later.'
);

const registerLimiter = createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3,               // 3 registrations
    'Too many registration attempts. Please try again later.'
);

const apiLimiter = createRateLimiter(
    60 * 1000,       // 1 minute
    100,             // 100 requests
    'Too many requests. Please slow down.'
);

module.exports = {
    createRateLimiter,
    authLimiter,
    registerLimiter,
    apiLimiter
};
