import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const auditMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    // Only log mutations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        res.send = function (body) {
            const user = (req as any).user;
            if (user) {
                const urlParts = req.originalUrl.split('/');
                const tabla = urlParts[2] || 'unknown';

                // Mask sensitive info in body if needed
                const details = { ...req.body };
                if (details.password) details.password = '********';

                pool.query(
                    `INSERT INTO auditoria (usuario_id, accion, tabla, detalles, ip_address)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [user.id, req.method, tabla, JSON.stringify(details), req.ip]
                ).catch(err => console.error('Audit Log Error:', err));
            }
            return originalSend.call(this, body);
        };
    }

    next();
};
