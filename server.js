const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const env = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const { apiLimiter } = require('./src/middlewares/rateLimitMiddleware');
const runSeed = require('./src/seed/runSeed');

// Importar Enrutadores
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const biometricRoutes = require('./src/routes/biometricRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const smoothieRoutes = require('./src/routes/smoothieRoutes');
const routineRoutes = require('./src/routes/routineRoutes');
const medicalVaultRoutes = require('./src/routes/medicalVaultRoutes');
const coachRoutes = require('./src/routes/coachRoutes');

const app = express();

// Ocultar firma de servidor Express por seguridad
app.disable('x-powered-by');

// Cabeceras de Seguridad Avanzadas con Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Permitir consumo de medios estáticos
    hidePoweredBy: true,
    frameguard: { action: 'deny' }, // Anti-clickjacking
    noSniff: true, // Impedir MIME sniffing
    xssFilter: true, // Anti Cross-Site Scripting
  })
);

// Configuración de CORS Segura
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parseo de Body con Límites de Tamaño Anti-DDoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Aplicar Límite de Peticiones Global (Rate Limiter)
app.use('/api', apiLimiter);

// Servir archivos estáticos de la carpeta de uploads de manera segura
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint de prueba de salud de la API (Healthcheck)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'API TeamFit Force Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    securityMode: 'Enterprise Shield Active',
  });
});

// Montar Rutas de los Módulos de la Aplicación Móvil
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/biometrics', biometricRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/smoothies', smoothieRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/medical-vault', medicalVaultRoutes);
app.use('/api/coach', coachRoutes);

// Manejador Global de Errores
app.use(errorMiddleware);

// Inicializar Servidor y Base de Datos
const startServer = async () => {
  await connectDB();
  await runSeed();

  app.listen(env.PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor API TeamFit Force Blindado & Seguro`);
    console.log(`📡 URL Base: http://localhost:${env.PORT}`);
    console.log(`🛡️  Modo Seguridad: Rate Limiting & JWT Estricto Activo`);
    console.log(`==================================================`);
  });
};

startServer();

module.exports = app;
