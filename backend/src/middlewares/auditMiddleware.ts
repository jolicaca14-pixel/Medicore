import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        rol: string;
    };
}

export const auditMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    const userId = req.user?.id;
    const method = req.method;
    const path = req.path;

    // Solo auditar acciones de modificación
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        res.json = function (data) {
            const auditData = {
                usuario_id: userId,
                accion: `${method} ${path}`,
                ip_address: req.ip,
                user_agent: req.get('user-agent'),
                datos_nuevos: method !== 'DELETE' ? JSON.stringify(req.body) : null,
                tabla: path.split('/')[2] // Intento de inferir la tabla desde la ruta /api/TABLA/...
            };

            pool.query(
                'INSERT INTO auditoria (usuario_id, accion, ip_address, user_agent, datos_nuevos, tabla) VALUES ($1, $2, $3, $4, $5, $6)',
                [auditData.usuario_id, auditData.accion, auditData.ip_address, auditData.user_agent, auditData.datos_nuevos, auditData.tabla]
            ).catch(err => console.error('Error recording audit log:', err));

            return originalJson.call(this, data);
        };
    }

    next();
};
