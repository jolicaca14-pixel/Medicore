// Tipos para el módulo de autenticación

export interface Usuario {
    id: string;
    username: string;
    password_hash: string;
    rol: 'admin' | 'professional' | 'secretary';
    nombre_completo: string;
    documento: string;
    email: string | null;
    activo: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface UsuarioSinPassword extends Omit<Usuario, 'password_hash'> { }

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    usuario: UsuarioSinPassword;
}

export interface JWTPayload {
    userId: string;
    username: string;
    rol: Usuario['rol'];
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface Sesion {
    id: string;
    usuario_id: string;
    refresh_token: string;
    expires_at: Date;
    created_at: Date;
}
