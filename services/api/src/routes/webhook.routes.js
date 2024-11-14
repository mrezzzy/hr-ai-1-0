import express from 'express';
import logger from '../config/logger.js';
import { apiKeyAuth } from '../middleware/apiKey.middleware.js';

const router = express.Router();

router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const webhookData = req.body;
    logger.info('Received webhook data:', webhookData);
    
    res.status(200).json({
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  logger.info('Webhook test endpoint called');
  res.json({ message: 'Webhook service is working' });
});

export default router;