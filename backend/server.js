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
import connectDB from './config/database.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Utils
import { setupInitialAdmin } from './utils/setupAdmin.js';

// ES Module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();

// Conectar a base de datos
connectDB();

// Setup admin inicial
setupInitialAdmin();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitar para desarrollo
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (prevenir abuso)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting a todas las rutas de API
app.use('/api/', limiter);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luminom IA Backend está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Servir frontend en rutas no-API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ════════════════════════════════════════════════════');
  console.log(`   LUMINOM IA - Servidor Backend`);
  console.log('   ════════════════════════════════════════════════════');
  console.log(`   🌐 Servidor corriendo en puerto: ${PORT}`);
  console.log(`   📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🤖 IA: Claude API (Anthropic)`);
  console.log(`   🔐 Autenticación: JWT`);
  console.log('   ════════════════════════════════════════════════════');
  console.log(`   🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`   📱 Frontend: http://localhost:${PORT}`);
  console.log(`   👤 Panel Admin: http://localhost:${PORT}/admin.html`);
  console.log('   ════════════════════════════════════════════════════\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // No cerrar el servidor en desarrollo
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

export default app;
