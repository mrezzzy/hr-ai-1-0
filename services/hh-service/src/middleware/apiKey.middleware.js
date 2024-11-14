import logger from '../config/logger.js';

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn('Invalid API key attempt', {
      ip: req.ip,
      path: req.path
    });
    
    return res.json({
      success: false,
      error: {
        message: 'Invalid API key'
      }
    });
  }
  
  next();
};