import express from 'express';
import logger from '../config/logger.js';
import { apiKeyAuth } from '../middleware/apiKey.middleware.js';

const router = express.Router();

router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const webhookData = req.body;
    logger.info('Received webhook data:', webhookData);
    
    res.json({
      success: true,
      message: 'Webhook received successfully'
    });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

export default router;