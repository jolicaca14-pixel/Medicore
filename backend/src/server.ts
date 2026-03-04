import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modulos/auth/routes';
import patientRoutes from './modulos/pacientes/routes';
import agendaRoutes from './modulos/agenda/routes';
import clinicalRoutes from './modulos/historias-clinicas/routes';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad
app.use(helmet());

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 intentos por ventana
    message: { error: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middlewares globales
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', patientRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/historias', clinicalRoutes);

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
