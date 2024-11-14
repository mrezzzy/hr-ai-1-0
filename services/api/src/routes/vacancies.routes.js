import express from 'express';
import logger from '../config/logger.js';
import { VacanciesService } from '../services/vacancies.service.js';
import { validateVacancySearch } from '../middleware/validateVacancySearch.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting: 100 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after a minute'
  }
});

router.get('/', limiter, validateVacancySearch, async (req, res) => {
  try {
    const {
      text,
      area,
      experience,
      employment,
      schedule,
      salary,
      currency
    } = req.query;

    logger.info('Received vacancy search request:', req.query);

    const vacancies = await VacanciesService.searchVacancies({
      text,
      area,
      experience,
      employment,
      schedule,
      salary,
      currency
    });

    res.json({
      success: true,
      data: vacancies
    });
  } catch (error) {
    logger.error('Error in vacancy search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;