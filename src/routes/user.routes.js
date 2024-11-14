import express from 'express';
import logger from '../config/logger.js';
import TokenService from '../services/token.service.js';
import { apiKeyAuth } from '../middleware/apiKey.middleware.js';

const router = express.Router();

router.get('/profile', apiKeyAuth, async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.json({
        success: false,
        error: {
          message: 'User ID is required'
        }
      });
    }

    const userData = await TokenService.getUserData(userId);
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

export default router;