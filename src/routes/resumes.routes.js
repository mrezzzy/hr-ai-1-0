import express from 'express';
import logger from '../config/logger.js';
import { ResumesService } from '../services/resumes.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting: 100 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again after a minute'
  }
});

/**
 * @api {get} /api/v1/resumes/:id/contacts Get resume contacts
 * Required headers:
 * - x-api-key: API key for authentication
 * - x-user-id: Adalo user ID
 */
router.get('/:id/contacts', limiter, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info('Fetching resume contacts:', {
      resumeId: id,
      userId: req.userId
    });

    const contacts = await ResumesService.getResumeContacts(id, req.hhToken);

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    logger.error('Error fetching resume contacts:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;