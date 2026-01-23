import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { Usuario } from '../types';

// Extender Request de Express para incluir usuario autenticado
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
                rol: Usuario['rol'];
            };
        }
    }
}

/**
 * Middleware para verificar JWT en el header Authorization
 */
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
    }

    try {
        const payload = AuthService.verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

/**
 * Middleware para verificar rol del usuario (RBAC)
 */
export const requireRole = (...roles: Usuario['rol'][]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'No autenticado' });
            return;
        }

        if (!roles.includes(req.user.rol)) {
            res.status(403).json({
                error: 'No tienes permisos para acceder a este recurso',
                requiredRoles: roles,
                yourRole: req.user.rol
            });
            return;
        }

        next();
    };
};
