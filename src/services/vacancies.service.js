import fetch from 'node-fetch';
import logger from '../config/logger.js';
import { HH_CONFIG } from '../config/constants.js';
import db from '../database/schema.js';
import TokenService from './token.service.js';

export class VacanciesService {
  static async searchVacancies({ text, area, experience, employment, schedule, salary, currency }) {
    try {
      logger.info('Searching vacancies with params:', { text, area });

      // Получаем актуальный токен
      const token = await TokenService.getAccessToken();

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
          'User-Agent': HH_CONFIG.USER_AGENT,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('HH API error:', error);
        throw new Error(error.description || 'Failed to fetch vacancies');
      }

      const data = await response.json();
      const transformedData = this.transformVacanciesForAdalo(data);
      
      // Сохраняем вакансии в БД
      await this.saveVacancies(transformedData.items);
      
      return transformedData;
    } catch (error) {
      logger.error('Error searching vacancies:', error);
      throw error;
    }
  }

  static async saveVacancies(vacancies) {
    try {
      // Используем транзакцию для атомарного сохранения
      await db.transaction(async trx => {
        for (const vacancy of vacancies) {
          await trx('vacancies')
            .insert({
              id: vacancy.id,
              title: vacancy.title,
              company: vacancy.company,
              salary_from: vacancy.salary?.from,
              salary_to: vacancy.salary?.to,
              salary_currency: vacancy.salary?.currency,
              experience: vacancy.experience,
              schedule: vacancy.schedule,
              employment: vacancy.employment,
              description: vacancy.description,
              requirements: vacancy.requirements,
              responsibilities: vacancy.responsibilities,
              url: vacancy.url,
              published_at: vacancy.published_at,
              address: vacancy.address,
              company_logo: vacancy.company_logo
            })
            .onConflict('id')
            .merge();
        }
      });
      
      logger.info(`Saved ${vacancies.length} vacancies to database`);
    } catch (error) {
      logger.error('Error saving vacancies to database:', error);
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