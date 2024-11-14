import { HH_CONFIG } from '../config/constants.js';
import logger from '../config/logger.js';

export const validateVacancySearch = (req, res, next) => {
  const { area, experience, employment, schedule } = req.query;

  const errors = [];

  if (area && !Object.values(HH_CONFIG.AREAS).includes(area)) {
    errors.push(`Invalid area code. Allowed values: ${Object.values(HH_CONFIG.AREAS).join(', ')}`);
  }

  if (experience && !Object.values(HH_CONFIG.EXPERIENCE).includes(experience)) {
    errors.push(`Invalid experience value. Allowed values: ${Object.values(HH_CONFIG.EXPERIENCE).join(', ')}`);
  }

  if (employment && !Object.values(HH_CONFIG.EMPLOYMENT).includes(employment)) {
    errors.push(`Invalid employment type. Allowed values: ${Object.values(HH_CONFIG.EMPLOYMENT).join(', ')}`);
  }

  if (schedule && !Object.values(HH_CONFIG.SCHEDULE).includes(schedule)) {
    errors.push(`Invalid schedule type. Allowed values: ${Object.values(HH_CONFIG.SCHEDULE).join(', ')}`);
  }

  if (errors.length > 0) {
    logger.warn('Validation errors in vacancy search:', { errors });
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};