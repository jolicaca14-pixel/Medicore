import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modulos/auth/routes';
import patientRoutes from './modulos/pacientes/routes';
import agendaRoutes from './modulos/agenda/routes';
import clinicalRoutes from './modulos/historias-clinicas/routes';
import recetaRoutes from './modulos/recetas/routes';
import diagnosticRoutes from './modulos/diagnosticos/routes';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', patientRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/historias-clinicas', clinicalRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/diagnosticos', diagnosticRoutes);

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
            'historias-clinicas': '/api/historias-clinicas',
            recetas: '/api/recetas',
            diagnosticos: '/api/diagnosticos'
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
