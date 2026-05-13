// Logger middleware
const logger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // Capture response finish to log response time
    const originalSend = res.send;
    res.send = function (...args) {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration}ms`);
        return originalSend.apply(res, args);
    };
    
    next();
};

module.exports = logger;