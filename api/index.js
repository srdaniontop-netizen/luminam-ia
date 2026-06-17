import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración
dotenv.config();

// Database
import connectDB from '../backend/config/database.js';

// Routes
import authRoutes from '../backend/routes/authRoutes.js';
import chatRoutes from '../backend/routes/chatRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';

// Utils
import { setupInitialAdmin } from '../backend/utils/setupAdmin.js';

// ES Module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();

// Variable para cachear la conexión de MongoDB
let isConnected = false;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/views', express.static(path.join(__dirname, '../frontend/views')));
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luminom IA Backend está funcionando correctamente en Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: isConnected ? 'conectado' : 'desconectado'
  });
});

// Servir frontend en rutas no-API
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

app.get('/tutor.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/tutor.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Export para Vercel (serverless)
export default async function handler(req, res) {
  try {
    // Conectar a MongoDB solo si no está conectado (cachear conexión)
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      
      // Setup admin inicial (solo una vez)
      setupInitialAdmin().catch(err => {
        console.log('Admin setup:', err.message);
      });
    }
    
    // Procesar request con Express
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
