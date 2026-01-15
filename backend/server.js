require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/config/logger');
const { prismaErrorHandler, globalErrorHandler } = require('./src/middleware/errorHandler');

// Routes
const authRoutes = require('./src/routes/auth');
const coursesRoutes = require('./src/routes/courses');
const personnelRoutes = require('./src/routes/personnel');
const crewsRoutes = require('./src/routes/crews');
const equipmentRoutes = require('./src/routes/equipment');
const knowledgeRoutes = require('./src/routes/knowledge');
const filesRoutes = require('./src/routes/files');
const practiceRoutes = require('./src/routes/practice');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - налаштування для CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false // Дозволяємо embed ресурси
}));

// CORS configuration - має бути ПЕРЕД іншими middleware
// Дозволені origins для production
const defaultAllowedOrigins = [
  'https://bastion125.github.io',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080'
];

// Отримуємо список дозволених origins
const getAllowedOrigins = () => {
  if (process.env.CORS_ORIGIN === '*') {
    return true; // Дозволяємо всі origins
  }
  
  const envOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
    : [];
  
  return envOrigins.length > 0 
    ? [...envOrigins, ...defaultAllowedOrigins]
    : defaultAllowedOrigins;
};

const corsOptions = {
  origin: function (origin, callback) {
    // Дозволяємо запити без origin (наприклад, Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = getAllowedOrigins();
    
    // Якщо allowedOrigins === true, дозволяємо всі
    if (allowedOrigins === true) {
      return callback(null, true);
    }
    
    // Перевіряємо чи origin в списку дозволених
    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // У development дозволяємо всі для зручності
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        // У production логуємо та блокуємо
        console.warn(`CORS: Blocked origin: ${origin}. Allowed: ${JSON.stringify(allowedOrigins)}`);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours - кешування preflight запитів
};

app.use(cors(corsOptions));

// Явна обробка OPTIONS запитів для CORS preflight (важливо для GitHub Pages)
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Root endpoint for Railway health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Training Recording System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    const prisma = require('./src/config/database');
    
    // Простий запит до БД для перевірки підключення
    await prisma.$queryRaw`SELECT 1 as test`;
    
    // Перевірка кількості таблиць
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    res.json({
      success: true,
      message: 'Database connection successful',
      database: {
        connected: true,
        tables: tableCount[0]?.count || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/crews', crewsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/practice', practiceRoutes);

// Error handling middleware (must be last)
app.use(prismaErrorHandler);
app.use(globalErrorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;

// Start server only when running directly (not when imported by tests)
if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 Server listening on 0.0.0.0:${PORT}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    logger.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}
