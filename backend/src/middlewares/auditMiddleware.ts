import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const auditMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    // Solo auditar acciones que modifican datos (POST, PUT, DELETE, PATCH)
    // O acciones sensibles de lectura si es necesario (ej. ver historia completa)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        res.send = function (body) {
            const usuario = (req as any).user;

            // Realizar auditoría de forma asíncrona para no bloquear la respuesta
            if (usuario) {
                const action = `${req.method} ${req.originalUrl}`;
                const module = req.originalUrl.split('/')[2] || 'unknown';

                // Limpiar datos sensibles del body antes de guardar
                const details = {
                    params: req.params,
                    query: req.query,
                    body: { ...req.body },
                    status: res.statusCode
                };

                if (details.body.password) details.body.password = '********';
                if (details.body.token) details.body.token = '********';

                pool.query(
                    'INSERT INTO auditoria (usuario_id, accion, modulo, detalle, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
                    [
                        usuario.id,
                        action,
                        module,
                        JSON.stringify(details),
                        req.ip,
                        req.get('User-Agent')
                    ]
                ).catch(err => console.error('[AUDIT ERROR]', err));
            }

            return originalSend.call(this, body);
        };
    }

    next();
};
