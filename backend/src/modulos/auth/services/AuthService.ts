import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../config/database';
import {
    Usuario,
    UsuarioSinPassword,
    LoginRequest,
    LoginResponse,
    JWTPayload
} from '../types';

const SALT_ROUNDS = 12;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'change_this_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change_this_secret';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class AuthService {
    /**
     * Autenticar usuario con username y password
     */
    static async login(credentials: LoginRequest): Promise<LoginResponse> {
        const { username, password } = credentials;

        // Buscar usuario por username
        const result = await pool.query<Usuario>(
            'SELECT * FROM usuarios WHERE username = $1 AND activo = true',
            [username]
        );

        if (result.rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }

        const usuario = result.rows[0];

        // Verificar contraseña con bcrypt
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            throw new Error('Credenciales inválidas');
        }

        // Generar tokens JWT
        const payload: JWTPayload = {
            userId: usuario.id,
            username: usuario.username,
            rol: usuario.rol,
        };

        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
        });

        // Guardar refresh token en base de datos
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

        await pool.query(
            'INSERT INTO sesiones (usuario_id, refresh_token, expires_at) VALUES ($1, $2, $3)',
            [usuario.id, refreshToken, expiresAt]
        );

        // Retornar usuario sin password
        const { password_hash, ...usuarioSinPassword } = usuario;

        return {
            accessToken,
            refreshToken,
            usuario: usuarioSinPassword,
        };
    }

    /**
     * Renovar access token usando refresh token
     */
    static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            // Verificar refresh token
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JWTPayload;

            // Verificar que el refresh token existe en la base de datos
            const result = await pool.query(
                'SELECT * FROM sesiones WHERE refresh_token = $1 AND expires_at > NOW()',
                [refreshToken]
            );

            if (result.rows.length === 0) {
                throw new Error('Refresh token inválido o expirado');
            }

            // Generar nuevo access token
            const newAccessToken = jwt.sign(
                {
                    userId: payload.userId,
                    username: payload.username,
                    rol: payload.rol,
                },
                JWT_ACCESS_SECRET,
                { expiresIn: JWT_ACCESS_EXPIRES_IN }
            );

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new Error('Refresh token inválido');
        }
    }

    /**
     * Cerrar sesión (invalidar refresh token)
     */
    static async logout(refreshToken: string): Promise<void> {
        await pool.query('DELETE FROM sesiones WHERE refresh_token = $1', [refreshToken]);
    }

    /**
     * Verificar access token
     */
    static verifyAccessToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload;
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    /**
     * Hash de contraseña con bcrypt
     */
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }
}
