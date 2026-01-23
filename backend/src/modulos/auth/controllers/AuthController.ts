import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginRequest } from '../types';

export class AuthController {
    /**
     * POST /api/auth/login
     * Autenticar usuario y retornar tokens JWT
     */
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const credentials: LoginRequest = req.body;

            if (!credentials.username || !credentials.password) {
                res.status(400).json({ error: 'Username y password son requeridos' });
                return;
            }

            const result = await AuthService.login(credentials);

            // Establecer refresh token en cookie HttpOnly
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            });

            res.status(200).json({
                accessToken: result.accessToken,
                usuario: result.usuario,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(401).json({ error: errorMessage });
        }
    }

    /**
     * POST /api/auth/refresh
     * Renovar access token usando refresh token
     */
    static async refresh(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token no proporcionado' });
                return;
            }

            const result = await AuthService.refreshAccessToken(refreshToken);

            res.status(200).json(result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(401).json({ error: errorMessage });
        }
    }

    /**
     * POST /api/auth/logout
     * Cerrar sesión e invalidar refresh token
     */
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }

            // Limpiar cookie
            res.clearCookie('refreshToken');

            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ error: errorMessage });
        }
    }

    /**
     * GET /api/auth/me
     * Obtener información del usuario autenticado
     */
    static async me(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }

            res.status(200).json({ usuario: req.user });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ error: errorMessage });
        }
    }
}
