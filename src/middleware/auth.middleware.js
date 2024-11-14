import logger from '../config/logger.js';
import TokenService from '../services/token.service.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Check API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      logger.warn('Invalid API key attempt', {
        ip: req.ip,
        path: req.path
      });
      return res.json({
        success: false,
        error: {
          code: 401,
          message: 'Invalid API key',
          details: 'The provided API key is invalid or missing'
        },
        data: null
      });
    }

    // Check user ID
    const userId = req.headers['x-user-id']?.replace(/[\[\]]/g, '');
    if (!userId) {
      return res.json({
        success: false,
        error: {
          code: 401,
          message: 'User ID is required',
          details: 'The x-user-id header is missing'
        },
        data: null
      });
    }

    // Get token from Redis
    try {
      const token = await TokenService.getAccessToken(userId);
      if (!token) {
        return res.json({
          success: false,
          error: {
            code: 401,
            message: 'User not authorized',
            details: 'No valid access token found for this user'
          },
          data: null
        });
      }

      // Add token and user_id to request
      req.hhToken = token;
      req.userId = userId;
      
      next();
    } catch (error) {
      logger.error('Error getting access token:', error);
      return res.json({
        success: false,
        error: {
          code: 401,
          message: 'Authentication failed',
          details: error.message
        },
        data: null
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.json({
      success: false,
      error: {
        code: 500,
        message: 'Authentication error',
        details: error.message
      },
      data: null
    });
  }
};