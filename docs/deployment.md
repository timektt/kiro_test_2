# Production Deployment Guide

This guide covers deploying the Community Platform to production environments.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis (optional, for caching)
- SSL certificate for HTTPS
- Domain name

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"
DIRECT_URL="postgresql://username:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (at least one required)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Optional Variables

```bash
# Email notifications
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# File uploads
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Caching
REDIS_URL="redis://localhost:6379"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Rate limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables

3. **Database Setup**
   - Use Vercel Postgres or external PostgreSQL service
   - Run migrations: `npx prisma migrate deploy`

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t community-platform .
   ```

2. **Run with Docker Compose**
   ```bash
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

3. **Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     app:
       image: community-platform:latest
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
       ports:
         - "3000:3000"
   ```

### Option 3: Traditional Server

1. **Server Setup**
   ```bash
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd community-platform
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "community-platform" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE community_platform;
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE community_platform TO app_user;
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Database (Optional)**
   ```bash
   npm run db:seed
   ```

## SSL Certificate

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Health Checks

1. **Health Check Endpoint**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Monitoring Setup**
   - Configure error tracking (Sentry)
   - Set up uptime monitoring
   - Monitor database performance
   - Track application metrics

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Regular security updates
- [ ] Backup strategy in place

## Performance Optimization

1. **Database Optimization**
   - Enable connection pooling
   - Add database indexes
   - Monitor slow queries

2. **Caching**
   - Enable Redis caching
   - Configure CDN for static assets
   - Implement API response caching

3. **Monitoring**
   - Set up application monitoring
   - Configure alerts for errors
   - Monitor resource usage

## Backup Strategy

1. **Database Backups**
   ```bash
   # Daily backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   pg_dump $DATABASE_URL > backup_$DATE.sql
   
   # Upload to cloud storage
   aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
   ```

2. **File Backups**
   - Backup uploaded files
   - Backup configuration files
   - Store backups in multiple locations

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   npx prisma db pull
   
   # Verify environment variables
   echo $DATABASE_URL
   ```

2. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Performance Issues**
   ```bash
   # Check application logs
   pm2 logs community-platform
   
   # Monitor resource usage
   htop
   ```

### Log Locations

- Application logs: `/var/log/community-platform/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `~/.pm2/logs/`

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   - Configure multiple application instances
   - Use sticky sessions for authentication
   - Implement health checks

2. **Database Scaling**
   - Read replicas for read-heavy workloads
   - Connection pooling
   - Query optimization

### Vertical Scaling

1. **Server Resources**
   - Monitor CPU and memory usage
   - Scale server resources as needed
   - Optimize application performance

## Support

For deployment issues:
1. Check the health endpoint: `/api/health`
2. Review application logs
3. Verify environment variables
4. Test database connectivity
5. Check SSL certificate validity

For additional help, refer to the troubleshooting section or create an issue in the repository.