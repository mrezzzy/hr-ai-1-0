import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import userRoutes from './routes/user.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(express.json());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path
  });
  next();
});

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/webhook', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'main-api',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});