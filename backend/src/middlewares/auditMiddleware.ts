import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const auditMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    // Redefine res.send to capture the response and log after the request is processed
    res.send = function (body) {
        const usuario_id = (req as any).user?.id;
        const accion = req.method;
        const path = req.path;

        // Determine entity based on path
        let entidad = 'unknown';
        let entidad_id = null;

        if (path.includes('/pacientes')) entidad = 'paciente';
        else if (path.includes('/auth')) entidad = 'auth';
        else if (path.includes('/historias-clinicas')) entidad = 'historia_clinica';
        else if (path.includes('/agenda')) entidad = 'cita';

        // Extract ID if present in params
        if (req.params.id) entidad_id = req.params.id;

        // Only log mutations or specific sensitive actions
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(accion)) {
            const detalles = {
                path,
                query: req.query,
                body: req.body, // In production, mask PII
                status: res.statusCode
            };

            // Mask sensitive data in body if it's a login attempt
            if (path.includes('/login')) {
                detalles.body = { ...req.body, password: '***' };
            }

            pool.query(
                'INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, detalles, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [usuario_id, accion, entidad, entidad_id, JSON.stringify(detalles), req.ip, req.headers['user-agent']]
            ).catch(err => console.error('Error recording audit log:', err));
        }

        return originalSend.apply(res, arguments as any);
    };

    next();
};
