import logger from '../config/logger.js';

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn('Invalid API key attempt', {
      ip: req.ip,
      path: req.path
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  next();
};