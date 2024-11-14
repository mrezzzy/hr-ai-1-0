import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import webhookRoutes from './webhook.routes.js';
import hhRoutes from './hh.routes.js';
import { apiKeyAuth } from '../middleware/apiKey.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Public routes
router.use('/hh', hhRoutes);

// Protected routes
router.use('/webhook', apiKeyAuth, webhookRoutes);

// Root API response
router.get('/', (req, res) => {
  res.json({
    message: 'AI-HR API',
    version: '1.0.0',
    endpoints: {
      webhook: '/api/v1/webhook (protected)',
      hh: '/api/v1/hh',
      auth: '/public/hh-auth.html'
    }
  });
});

export default router;