# Task 04: Production Monitoring

## 📋 Overview
**Priority:** High  
**Estimated Time:** 60-90 minutes  
**Prerequisites:** Basic app functionality working  

## 🎯 Objective
ตั้งค่าระบบ monitoring และ error tracking สำหรับ production environment เพื่อติดตามประสิทธิภาพและจัดการข้อผิดพลาด

## 📝 Task Details

### Step 1: Sentry Error Tracking Setup
1. **สร้าง Sentry Account**
   - ไปที่ [Sentry.io](https://sentry.io/)
   - สร้าง account และ organization
   - สร้าง project สำหรับ Next.js

2. **ติดตั้ง Sentry SDK**
   ```bash
   npm install @sentry/nextjs @sentry/tracing
   ```

3. **สร้าง Sentry Configuration**
   ```bash
   # สร้างไฟล์ sentry.client.config.ts
   touch sentry.client.config.ts
   
   # สร้างไฟล์ sentry.server.config.ts
   touch sentry.server.config.ts
   
   # สร้างไฟล์ sentry.edge.config.ts
   touch sentry.edge.config.ts
   ```

4. **เพิ่ม Sentry Environment Variables**
   ```env
   # Sentry Configuration
   SENTRY_DSN="your-sentry-dsn-here"
   SENTRY_ORG="your-org-name"
   SENTRY_PROJECT="your-project-name"
   SENTRY_AUTH_TOKEN="your-auth-token"
   NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn-here"
   ```

### Step 2: Vercel Analytics Setup
1. **เปิดใช้งาน Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **เพิ่ม Analytics ใน Layout**
   ```typescript
   // ใน src/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

3. **เพิ่ม Environment Variables**
   ```env
   # Vercel Analytics
   NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
   ```

### Step 3: Performance Monitoring
1. **Web Vitals Tracking**
   ```bash
   # สร้างไฟล์ performance monitoring
   touch src/lib/performance.ts
   ```

2. **Custom Performance Metrics**
   ```typescript
   // ใน src/lib/performance.ts
   export function trackPerformance(name: string, value: number) {
     // Send to analytics service
   }
   ```

3. **Database Query Monitoring**
   ```bash
   # เพิ่ม Prisma logging
   # ใน prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
     log      = ["query", "info", "warn", "error"]
   }
   ```

### Step 4: Uptime Monitoring
1. **ตั้งค่า Uptime Robot หรือ Pingdom**
   - สร้าง account ที่ [UptimeRobot](https://uptimerobot.com/)
   - เพิ่ม monitor สำหรับ production URL
   - ตั้งค่า alert notifications

2. **Health Check Endpoint**
   ```bash
   # สร้าง health check API
   touch src/app/api/health/route.ts
   ```

### Step 5: Logging System
1. **ตั้งค่า Winston Logger**
   ```bash
   npm install winston winston-daily-rotate-file
   ```

2. **สร้าง Logger Configuration**
   ```bash
   touch src/lib/logger.ts
   ```

3. **เพิ่ม Log Levels**
   ```env
   # Logging Configuration
   LOG_LEVEL="info"
   LOG_FILE_PATH="./logs"
   ```

### Step 6: Rate Limiting & Security
1. **ตั้งค่า Upstash Redis**
   - สร้าง account ที่ [Upstash](https://upstash.com/)
   - สร้าง Redis database
   - เพิ่ม connection string

2. **เพิ่ม Rate Limiting Environment Variables**
   ```env
   # Rate Limiting (Upstash Redis)
   UPSTASH_REDIS_REST_URL="your-redis-url"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"
   ```

3. **Security Headers**
   ```bash
   # อัพเดท next.config.js สำหรับ security headers
   ```

## ✅ Checklist

### Sentry Setup
- [ ] สร้าง Sentry project แล้ว
- [ ] ติดตั้ง @sentry/nextjs แล้ว
- [ ] สร้าง sentry config files แล้ว
- [ ] เพิ่ม SENTRY_DSN ใน environment variables แล้ว
- [ ] ทดสอบ error tracking ทำงาน

### Analytics
- [ ] ติดตั้ง @vercel/analytics แล้ว
- [ ] เพิ่ม Analytics component ใน layout แล้ว
- [ ] ตั้งค่า custom events tracking แล้ว
- [ ] ทดสอบ analytics data collection

### Performance Monitoring
- [ ] ตั้งค่า Web Vitals tracking แล้ว
- [ ] เพิ่ม custom performance metrics แล้ว
- [ ] ตั้งค่า database query logging แล้ว
- [ ] Performance dashboard accessible

### Uptime Monitoring
- [ ] ตั้งค่า uptime monitoring service แล้ว
- [ ] สร้าง health check endpoint แล้ว
- [ ] ตั้งค่า alert notifications แล้ว
- [ ] ทดสอบ uptime alerts

### Logging
- [ ] ติดตั้ง winston logger แล้ว
- [ ] สร้าง logger configuration แล้ว
- [ ] ตั้งค่า log rotation แล้ว
- [ ] ทดสอบ logging ใน different environments

### Security & Rate Limiting
- [ ] ตั้งค่า Upstash Redis แล้ว
- [ ] เพิ่ม rate limiting middleware แล้ว
- [ ] ตั้งค่า security headers แล้ว
- [ ] ทดสอบ rate limiting ทำงาน

## 🚨 Common Issues

### Sentry Configuration Issues
```bash
# Error: Sentry DSN not found
# Solution: ตรวจสอบ environment variables
echo $SENTRY_DSN
```

### Analytics Not Working
```bash
# Error: Analytics not tracking
# Solution: ตรวจสอบ Vercel deployment และ analytics ID
```

### Performance Issues
```bash
# Error: High memory usage
# Solution: ตรวจสอบ memory leaks และ optimize queries
```

### Rate Limiting Issues
```bash
# Error: Redis connection failed
# Solution: ตรวจสอบ Upstash credentials และ network access
```

## 🔧 Commands

```bash
# Quick monitoring setup
npm run task:monitoring-setup

# Manual setup steps
npm install @sentry/nextjs @vercel/analytics winston
npm run build
npm run start

# Test monitoring
npm run test:monitoring

# Check logs
tail -f logs/app.log

# Test error tracking
curl -X POST http://localhost:3000/api/test-error
```

## 📊 Monitoring Dashboard

หลังจากตั้งค่าเสร็จ ควรมี dashboards:

### Sentry Dashboard
- Error tracking และ performance
- User impact analysis
- Release tracking

### Vercel Analytics
- Page views และ user sessions
- Performance metrics
- Conversion tracking

### Uptime Monitoring
- Server uptime percentage
- Response time monitoring
- Downtime alerts

## 🔍 Testing Monitoring

### Error Tracking Test
```bash
# ทดสอบ Sentry error capture
curl -X POST http://localhost:3000/api/test-error

# ตรวจสอบใน Sentry dashboard
```

### Performance Test
```bash
# ทดสอบ performance monitoring
npm run lighthouse

# ตรวจสอบ Web Vitals
```

### Rate Limiting Test
```bash
# ทดสอบ rate limiting
for i in {1..20}; do curl http://localhost:3000/api/test; done
```

## 📈 Key Metrics to Monitor

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Response Time**: API endpoints
- **Database Performance**: Query execution time
- **Memory Usage**: Server memory consumption

### Business Metrics
- **User Engagement**: Session duration, page views
- **Conversion Rates**: Sign-ups, posts created
- **Error Rates**: 4xx, 5xx errors
- **Uptime**: Service availability

## 📚 References

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Web Vitals](https://web.dev/vitals/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [Upstash Redis](https://docs.upstash.com/redis)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 05: Real-time Chat System](./05-realtime-chat.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)