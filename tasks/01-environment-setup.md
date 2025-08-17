# Task 01: Environment Setup

## 📋 Overview
**Priority:** High  
**Estimated Time:** 30-45 minutes  
**Prerequisites:** Node.js 18+, PostgreSQL database  

## 🎯 Objective
ตั้งค่าสภาพแวดล้อมการพัฒนาให้พร้อมใช้งาน รวมถึงการกำหนดค่า environment variables และการเชื่อมต่อฐานข้อมูล

## 📝 Task Details

### Step 1: Environment Variables Setup
1. **สร้างไฟล์ .env.local**
   ```bash
   cp .env.example .env.local
   ```

2. **กำหนดค่าตัวแปรสำคัญ**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/community_platform"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"
   
   # Application Settings
   NODE_ENV="development"
   APP_URL="http://localhost:3000"
   ```

3. **สร้าง NextAuth Secret**
   ```bash
   # Generate secure secret
   openssl rand -base64 32
   ```

### Step 2: Database Setup
1. **ตรวจสอบ PostgreSQL**
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   
   # Or check service status
   net start postgresql-x64-15
   ```

2. **สร้าง Database**
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres
   
   -- Create database
   CREATE DATABASE community_platform;
   
   -- Create user (optional)
   CREATE USER community_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE community_platform TO community_user;
   ```

3. **ทดสอบการเชื่อมต่อ**
   ```bash
   # Test database connection
   npm run db:generate
   ```

### Step 3: Dependencies Installation
1. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

2. **ตรวจสอบ Dependencies**
   ```bash
   npm audit
   npm run type-check
   ```

### Step 4: Validation
1. **รันการตรวจสอบสภาพแวดล้อม**
   ```bash
   npm run validate-env
   ```

2. **ทดสอบการรันแอป**
   ```bash
   npm run dev
   ```

## ✅ Checklist

### Environment Variables
- [ ] สร้างไฟล์ .env.local แล้ว
- [ ] กำหนด DATABASE_URL แล้ว
- [ ] กำหนด NEXTAUTH_URL แล้ว
- [ ] สร้าง NEXTAUTH_SECRET แล้ว
- [ ] กำหนด NODE_ENV=development แล้ว

### Database
- [ ] PostgreSQL service ทำงานแล้ว
- [ ] สร้าง database community_platform แล้ว
- [ ] ทดสอบการเชื่อมต่อสำเร็จ
- [ ] Prisma client generate สำเร็จ

### Application
- [ ] npm install สำเร็จ
- [ ] npm run type-check ผ่าน
- [ ] npm run validate-env ผ่าน
- [ ] npm run dev ทำงานได้
- [ ] เข้าถึง http://localhost:3000 ได้

## 🚨 Common Issues

### Database Connection Issues
```bash
# Error: database "community_platform" does not exist
# Solution: Create database manually
psql -U postgres -c "CREATE DATABASE community_platform;"
```

### Permission Issues
```bash
# Error: permission denied for database
# Solution: Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE community_platform TO your_user;"
```

### Port Already in Use
```bash
# Error: Port 3000 is already in use
# Solution: Kill process or use different port
lsof -ti:3000 | xargs kill -9
# Or
npm run dev -- -p 3001
```

## 🔧 Commands

```bash
# Quick setup (run all at once)
npm run task:env-setup

# Manual steps
cp .env.example .env.local
npm install
npm run db:generate
npm run validate-env
npm run dev
```

## 📚 References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Prisma Database Connection](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 02: Database Migration](./02-database-migration.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)