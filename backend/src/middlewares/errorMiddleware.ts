import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack || err.message || err);

    const statusCode = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
