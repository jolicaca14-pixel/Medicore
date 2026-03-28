import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

export const auditMiddleware = async (req: any, res: Response, next: NextFunction) => {
    // Solo auditamos métodos de escritura
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        // Interceptamos la finalización de la respuesta para auditar el resultado
        const originalSend = res.send;
        res.send = function(content) {
            const userId = req.user?.id;
            const action = `${req.method} ${req.originalUrl}`;
            const ip = req.ip || req.connection.remoteAddress;

            // Extraemos un recurso_id probable de la URL o el body
            const resourceId = req.params.id || (req.body && req.body.id);

            // Determinamos el tipo de recurso por la URL
            let resourceType = 'UNKNOWN';
            if (req.originalUrl.includes('pacientes')) resourceType = 'PATIENT';
            else if (req.originalUrl.includes('historias-clinicas')) resourceType = 'CLINICAL_RECORD';
            else if (req.originalUrl.includes('facturacion')) resourceType = 'BILLING';
            else if (req.originalUrl.includes('agenda')) resourceType = 'APPOINTMENT';
            else if (req.originalUrl.includes('auth')) resourceType = 'AUTH';

            // Ejecutamos el log de forma asíncrona (fire and forget en el flujo principal)
            pool.query(
                'INSERT INTO auditoria (usuario_id, accion, recurso_tipo, recurso_id, detalles, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, action, resourceType, resourceId, JSON.stringify({ status: res.statusCode }), ip]
            ).catch(err => console.error('Error logging audit:', err));

            return originalSend.apply(res, arguments as any);
        };
    }
    next();
};
