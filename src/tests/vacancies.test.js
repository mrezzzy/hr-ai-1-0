import request from 'supertest';
import express from 'express';
import vacanciesRoutes from '../routes/vacancies.routes.js';
import { validateVacancySearch } from '../middleware/validateVacancySearch.js';

const app = express();
app.use(express.json());
app.use('/api/v1/vacancies', validateVacancySearch, vacanciesRoutes);

describe('Vacancies API', () => {
  test('GET /api/v1/vacancies should return vacancies list', async () => {
    const res = await request(app)
      .get('/api/v1/vacancies')
      .query({ area: '1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('items');
  });

  test('should validate area parameter', async () => {
    const res = await request(app)
      .get('/api/v1/vacancies')
      .query({ area: 'invalid' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});