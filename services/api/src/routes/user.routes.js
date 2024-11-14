import express from 'express';
import logger from '../config/logger.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  logger.info('User test endpoint called');
  res.json({ message: 'User service is working' });
});

export default router;