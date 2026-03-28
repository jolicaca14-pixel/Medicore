import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auditMiddleware } from './middlewares/auditMiddleware';
import dotenv from 'dotenv';
import authRoutes from './modulos/auth/routes';
import patientRoutes from './modulos/pacientes/routes';
import agendaRoutes from './modulos/agenda/routes';
import billingRoutes from './modulos/facturacion/routes';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// 🛡️ MORPHEUS: Security Hardening
app.use(helmet());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Limitar cada IP a 10 intentos de login por ventana
    message: { error: 'Demasiados intentos de acceso. Intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middlewares globales
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(auditMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use('/api/auth/login', authLimiter); // Aplicar rate limit solo a login
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', patientRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/facturacion', billingRoutes);

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'MediCore Backend API'
    });
});

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'MediCore Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            pacientes: '/api/pacientes',
            agenda: '/api/agenda',
            facturacion: '/api/facturacion',
        }
    });
});

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   MediCore Backend API                ║
║   Puerto: ${PORT}                        ║
║   Entorno: ${process.env.NODE_ENV || 'development'}       ║
║   CORS: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}  ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
