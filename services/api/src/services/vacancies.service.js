import fetch from 'node-fetch';
import logger from '../config/logger.js';
import { HH_CONFIG } from '../config/constants.js';

export class VacanciesService {
  static async searchVacancies({ text, area, experience, employment, schedule, salary, currency }) {
    try {
      logger.info('Searching vacancies with params:', { text, area });

      const params = new URLSearchParams({
        text: text || '',
        area: area || '1', // Default to Moscow
        per_page: '100',
        ...experience && { experience },
        ...employment && { employment },
        ...schedule && { schedule },
        ...salary && { salary },
        ...currency && { currency }
      });

      const response = await fetch(`${HH_CONFIG.API_URL}/vacancies?${params}`, {
        headers: {
          'User-Agent': HH_CONFIG.USER_AGENT
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('HH API error:', error);
        throw new Error(error.description || 'Failed to fetch vacancies');
      }

      const data = await response.json();
      return this.transformVacanciesForAdalo(data);
    } catch (error) {
      logger.error('Error searching vacancies:', error);
      throw error;
    }
  }

  static transformVacanciesForAdalo(data) {
    return {
      items: data.items.map(vacancy => ({
        id: vacancy.id,
        title: vacancy.name,
        company: vacancy.employer.name,
        salary: vacancy.salary ? {
          from: vacancy.salary.from,
          to: vacancy.salary.to,
          currency: vacancy.salary.currency
        } : null,
        experience: vacancy.experience?.name || 'Not specified',
        schedule: vacancy.schedule?.name,
        employment: vacancy.employment?.name,
        description: vacancy.description,
        requirements: vacancy.snippet?.requirement || '',
        responsibilities: vacancy.snippet?.responsibility || '',
        url: vacancy.alternate_url,
        published_at: vacancy.published_at,
        address: vacancy.address?.raw || null,
        company_logo: vacancy.employer.logo_urls?.original
      })),
      found: data.found,
      pages: Math.ceil(data.found / 100),
      page: data.page
    };
  }
}