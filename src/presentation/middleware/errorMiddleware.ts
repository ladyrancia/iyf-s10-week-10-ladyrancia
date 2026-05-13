import { Request, Response, NextFunction } from 'express';

// Custom error class
export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// Error handling middleware
export const errorHandler = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);

    const statusCode = (err as ApiError).statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Route not found' });
};