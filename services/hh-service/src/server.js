import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiKeyAuth } from './middleware/apiKey.middleware.js';

dotenv.config();

const app = express();
const PORT = 3001; // Fixed port for HH service

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path
  });
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', apiKeyAuth, resumeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'hh-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`HH Service running on port ${PORT}`);
});