import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(200).json({
    success: false,
    error: {
      code: err.status || 500,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      details: process.env.NODE_ENV === 'production'
        ? null
        : err.stack
    },
    data: null
  });
};