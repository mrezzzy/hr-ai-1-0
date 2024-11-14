## Deployment Guide

### Prerequisites

- Docker
- Docker Compose
- Domain with SSL certificate

### SSL Certificate Setup

1. Generate SSL certificate:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout nginx/ssl/ai-hr.ru.key \
-out nginx/ssl/ai-hr.ru.crt \
-subj "/C=RU/ST=Moscow/L=Moscow/O=AI-HR/CN=ai-hr.ru"
```

2. Set proper permissions:
```bash
chmod 600 nginx/ssl/ai-hr.ru.key
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Update environment variables with production values

### Docker Deployment

1. Build and start containers:
```bash
docker-compose up -d
```

2. Check logs:
```bash
docker-compose logs -f
```

3. Monitor containers:
```bash
docker-compose ps
```

### Maintenance

- Backup logs: `tar -czf logs-backup.tar.gz logs/`
- Update SSL certificates: Replace files in `nginx/ssl/`
- Restart services: `docker-compose restart`

### Troubleshooting

1. Check logs:
```bash
docker-compose logs -f api
docker-compose logs -f nginx
```

2. Verify SSL:
```bash
openssl s_client -connect ai-hr.ru:443 -servername ai-hr.ru
```

3. Test endpoints:
```bash
curl -k https://ai-hr.ru/health
```