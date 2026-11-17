
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================

const normalizeOrigin = (origin) => {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
};

const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.CORS_ORIGINS
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

// Allow localhost only during development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173');
  allowedOrigins.add('http://127.0.0.1:5173');
}

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without browser Origin header
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

// ==========================================
// 2. SECURITY MIDDLEWARE
// ==========================================

app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json({ limit: '100kb' }));

app.use(express.urlencoded({
  extended: false,
  limit: '100kb'
}));

// ==========================================
// 3. HEALTH CHECK API
// ==========================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskMatrix API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 4. API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/payments', paymentRoutes);

// ==========================================
// 5. ERROR HANDLING
// ==========================================

app.use(notFound);

app.use(errorHandler);

export default app;
