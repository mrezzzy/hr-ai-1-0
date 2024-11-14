## AI-HR API

API service for integrating HeadHunter.ru with Adalo applications.

### Features

- HeadHunter OAuth2 authentication
- Vacancy search with filters
- Webhook handling
- Rate limiting
- SSL/TLS support
- Docker deployment

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. For production: `docker-compose up -d`

### API Documentation

#### Vacancies

GET `/api/v1/vacancies`

Query parameters:
- text: Search text
- area: Area code (1 = Moscow, 2 = Saint Petersburg, etc.)
- experience: Experience level
- employment: Employment type
- schedule: Work schedule
- salary: Desired salary
- currency: Salary currency

Response format:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "found": 100,
    "pages": 1,
    "page": 0
  }
}
```

### Development

- Run tests: `npm test`
- Check logs: `docker-compose logs -f`
- Generate SSL certificate: See deployment guide

### Deployment

Detailed deployment instructions in DEPLOYMENT.md