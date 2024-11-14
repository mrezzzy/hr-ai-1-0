import express from 'express';
import { HHService } from '../services/hh.service.js';
import logger from '../config/logger.js';
import TokenService from '../services/token.service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const token = await TokenService.getAccessToken(userId);
    const resume = await HHService.getResume(id, token);

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    logger.error('Error fetching resume:', error);
    res.json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

router.get('/:id/contacts', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const token = await TokenService.getAccessToken(userId);
    const contacts = await HHService.getResumeContacts(id, token);

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    logger.error('Error fetching resume contacts:', error);
    res.json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

export default router;