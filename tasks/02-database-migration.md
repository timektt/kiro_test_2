# Task 02: Database Migration

## 📋 Overview
**Priority:** High  
**Estimated Time:** 20-30 minutes  
**Prerequisites:** Task 01 completed, Database connection ready  

## 🎯 Objective
รัน Prisma migration เพื่อสร้างโครงสร้างฐานข้อมูลและเพิ่มข้อมูลตัวอย่างเพื่อการทดสอบ

## 📝 Task Details

### Step 1: Database Schema Review
1. **ตรวจสอบ Prisma Schema**
   ```bash
   # ดู schema ปัจจุบัน
   cat prisma/schema.prisma
   ```

2. **ตรวจสอบ Migrations ที่มีอยู่**
   ```bash
   ls -la prisma/migrations/
   ```

### Step 2: Generate Prisma Client
1. **Generate Prisma Client**
   ```bash
   npm run db:generate
   # หรือ
   npx prisma generate
   ```

2. **ตรวจสอบการ Generate**
   ```bash
   # ตรวจสอบว่า client ถูกสร้างแล้ว
   ls -la node_modules/.prisma/client/
   ```

### Step 3: Database Migration
1. **Push Schema to Database**
   ```bash
   npm run db:push
   # หรือ
   npx prisma db push
   ```

2. **หรือใช้ Migration (สำหรับ Production)**
   ```bash
   npm run db:migrate
   # หรือ
   npx prisma migrate dev --name init_schema
   ```

3. **ตรวจสอบ Tables ที่สร้าง**
   ```bash
   # เชื่อมต่อ database และดู tables
   npx prisma studio
   # หรือใช้ psql
   psql -d community_platform -c "\dt"
   ```

### Step 4: Seed Database
1. **รัน Seed Script**
   ```bash
   npm run db:seed
   # หรือ
   npx tsx prisma/seed.ts
   ```

2. **ตรวจสอบข้อมูลที่ Seed**
   ```bash
   # เปิด Prisma Studio เพื่อดูข้อมูล
   npx prisma studio
   ```

### Step 5: Database Indexes
1. **เพิ่ม Performance Indexes**
   ```bash
   # รัน performance indexes script
   psql -d community_platform -f prisma/migrations/add_performance_indexes.sql
   ```

2. **ตรวจสอบ Indexes**
   ```sql
   -- ดู indexes ที่สร้าง
   SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
   ```

## ✅ Checklist

### Prisma Setup
- [ ] Prisma client generate สำเร็จ
- [ ] Schema validation ผ่าน
- [ ] Database connection ทำงาน

### Migration
- [ ] Database push/migrate สำเร็จ
- [ ] Tables ถูกสร้างครบถ้วน (users, posts, comments, likes, etc.)
- [ ] Foreign keys ถูกสร้างถูกต้อง
- [ ] Indexes ถูกสร้างแล้ว

### Seed Data
- [ ] Seed script รันสำเร็จ
- [ ] มีข้อมูล users ตัวอย่าง
- [ ] มีข้อมูล posts ตัวอย่าง
- [ ] มีข้อมูล MBTI types
- [ ] มีข้อมูล admin user

### Validation
- [ ] Prisma Studio เปิดได้
- [ ] ดูข้อมูลใน tables ได้
- [ ] Query ข้อมูลได้ปกติ

## 📊 Expected Tables

หลังจาก migration เสร็จ ควรมี tables ดังนี้:

```
Tables:
- accounts (NextAuth)
- sessions (NextAuth) 
- verificationtokens (NextAuth)
- users (Main user data)
- mbti (MBTI personality types)
- posts (User posts)
- comments (Post comments)
- likes (Post likes)
- follows (User follows)
- notifications (User notifications)
- rankings (User rankings)
```

## 🚨 Common Issues

### Migration Fails
```bash
# Error: Migration failed
# Solution: Reset and try again
npm run db:reset
npm run db:push
```

### Seed Data Issues
```bash
# Error: Seed script fails
# Solution: Check database connection and schema
npx prisma db push --force-reset
npm run db:seed
```

### Permission Issues
```bash
# Error: Permission denied
# Solution: Grant database permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;"
```

## 🔧 Commands

```bash
# Quick migration (run all at once)
npm run task:db-migration

# Manual steps
npm run db:generate
npm run db:push
npm run db:seed
npx prisma studio

# Reset if needed
npm run db:reset
```

## 📋 Seed Data Overview

Seed script จะสร้าง:
- **Admin User**: admin@example.com / admin123
- **Test Users**: 5-10 users with different MBTI types
- **Sample Posts**: 20-30 posts with various content
- **Comments**: Comments on posts
- **Likes**: Like interactions
- **MBTI Data**: All 16 personality types

## 🔍 Verification Commands

```bash
# ตรวจสอบ tables
psql -d community_platform -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# นับจำนวนข้อมูลในแต่ละ table
psql -d community_platform -c "SELECT 'users' as table_name, count(*) FROM users UNION SELECT 'posts', count(*) FROM posts UNION SELECT 'comments', count(*) FROM comments;"

# ตรวจสอบ admin user
psql -d community_platform -c "SELECT id, email, role FROM users WHERE role = 'ADMIN';"
```

## 📚 References

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 03: OAuth Configuration](./03-oauth-configuration.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)