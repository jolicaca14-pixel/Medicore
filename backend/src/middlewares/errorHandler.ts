import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(status).json({
        error: message,
        status: 'error',
        timestamp: new Date().toISOString(),
        path: req.path
    });
};
