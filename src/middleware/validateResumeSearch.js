import { HH_CONFIG } from '../config/constants.js';
import logger from '../config/logger.js';

export const validateResumeSearch = (req, res, next) => {
  const { 
    area,
    experience,
    education_level,
    age_from,
    age_to,
    gender,
    employment,
    schedule,
    language,
    currency,
    'text.logic': textLogic,
    'text.field': textField,
    'text.period': textPeriod
  } = req.query;

  const errors = [];

  // Validate area
  if (area && !Object.values(HH_CONFIG.AREAS).includes(area)) {
    errors.push(`Invalid area code. Allowed values: ${Object.values(HH_CONFIG.AREAS).join(', ')}`);
  }

  // Validate experience
  if (experience && !Object.values(HH_CONFIG.EXPERIENCE).includes(experience)) {
    errors.push(`Invalid experience value. Allowed values: ${Object.values(HH_CONFIG.EXPERIENCE).join(', ')}`);
  }

  // Validate education level
  if (education_level && !Object.values(HH_CONFIG.EDUCATION_LEVEL).includes(education_level)) {
    errors.push(`Invalid education level. Allowed values: ${Object.values(HH_CONFIG.EDUCATION_LEVEL).join(', ')}`);
  }

  // Validate age range
  if (age_from && (isNaN(age_from) || age_from < 14 || age_from > 100)) {
    errors.push('Age from should be a number between 14 and 100');
  }
  if (age_to && (isNaN(age_to) || age_to < 14 || age_to > 100)) {
    errors.push('Age to should be a number between 14 and 100');
  }
  if (age_from && age_to && parseInt(age_from) > parseInt(age_to)) {
    errors.push('Age from cannot be greater than age to');
  }

  // Validate gender
  if (gender && !Object.values(HH_CONFIG.GENDER).includes(gender)) {
    errors.push(`Invalid gender value. Allowed values: ${Object.values(HH_CONFIG.GENDER).join(', ')}`);
  }

  // Validate employment
  if (employment && !Object.values(HH_CONFIG.EMPLOYMENT).includes(employment)) {
    errors.push(`Invalid employment type. Allowed values: ${Object.values(HH_CONFIG.EMPLOYMENT).join(', ')}`);
  }

  // Validate schedule
  if (schedule && !Object.values(HH_CONFIG.SCHEDULE).includes(schedule)) {
    errors.push(`Invalid schedule type. Allowed values: ${Object.values(HH_CONFIG.SCHEDULE).join(', ')}`);
  }

  // Validate text search parameters
  if (textLogic && !Object.values(HH_CONFIG.TEXT_LOGIC).includes(textLogic)) {
    errors.push(`Invalid text.logic value. Allowed values: ${Object.values(HH_CONFIG.TEXT_LOGIC).join(', ')}`);
  }
  if (textField && !textField.split(',').every(field => Object.values(HH_CONFIG.TEXT_FIELDS).includes(field))) {
    errors.push(`Invalid text.field value. Allowed values: ${Object.values(HH_CONFIG.TEXT_FIELDS).join(', ')}`);
  }
  if (textPeriod && !Object.values(HH_CONFIG.TEXT_PERIOD).includes(textPeriod)) {
    errors.push(`Invalid text.period value. Allowed values: ${Object.values(HH_CONFIG.TEXT_PERIOD).join(', ')}`);
  }

  // Validate currency
  if (currency && !Object.values(HH_CONFIG.CURRENCY).includes(currency)) {
    errors.push(`Invalid currency value. Allowed values: ${Object.values(HH_CONFIG.CURRENCY).join(', ')}`);
  }

  if (errors.length > 0) {
    logger.warn('Validation errors in resume search:', { errors });
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};