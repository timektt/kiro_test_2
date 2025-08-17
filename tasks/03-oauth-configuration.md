# Task 03: OAuth Configuration

## 📋 Overview
**Priority:** High  
**Estimated Time:** 45-60 minutes  
**Prerequisites:** Task 01-02 completed, Google/GitHub developer accounts  

## 🎯 Objective
ตั้งค่า OAuth providers (Google และ GitHub) สำหรับระบบ authentication และทดสอบการ login

## 📝 Task Details

### Step 1: Google OAuth Setup
1. **สร้าง Google Cloud Project**
   - ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
   - สร้าง project ใหม่หรือเลือก project ที่มีอยู่
   - เปิดใช้งาน Google+ API

2. **สร้าง OAuth 2.0 Credentials**
   ```
   Google Cloud Console → APIs & Services → Credentials
   → Create Credentials → OAuth 2.0 Client IDs
   
   Application Type: Web Application
   Name: Community Platform
   
   Authorized JavaScript origins:
   - http://localhost:3000
   - https://yourdomain.com (for production)
   
   Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://yourdomain.com/api/auth/callback/google
   ```

3. **เพิ่ม Google Credentials ใน .env.local**
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### Step 2: GitHub OAuth Setup
1. **สร้าง GitHub OAuth App**
   - ไปที่ [GitHub Developer Settings](https://github.com/settings/developers)
   - คลิก "New OAuth App"
   
   ```
   Application name: Community Platform
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

2. **เพิ่ม GitHub Credentials ใน .env.local**
   ```env
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### Step 3: NextAuth Configuration
1. **ตรวจสอบ NextAuth Config**
   ```bash
   # ดูไฟล์ config
   cat src/app/api/auth/[...nextauth]/route.ts
   ```

2. **อัพเดท Environment Variables**
   ```env
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### Step 4: Test OAuth Integration
1. **รันแอปพลิเคชัน**
   ```bash
   npm run dev
   ```

2. **ทดสอบ OAuth Providers**
   - เปิด http://localhost:3000/auth/signin
   - ทดสอบ login ด้วย Google
   - ทดสอบ login ด้วย GitHub
   - ทดสอบ logout

3. **ตรวจสอบ Database Records**
   ```bash
   # เปิด Prisma Studio
   npx prisma studio
   
   # หรือใช้ SQL query
   psql -d community_platform -c "SELECT * FROM users ORDER BY created_at DESC LIMIT 5;"
   psql -d community_platform -c "SELECT * FROM accounts;"
   ```

### Step 5: Credentials Provider (Optional)
1. **เพิ่ม Email/Password Login**
   ```env
   # Email Configuration (optional)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

2. **ทดสอบ Email/Password Registration**
   - ไปที่ http://localhost:3000/auth/signup
   - สร้าง account ใหม่
   - ทดสอบ login

## ✅ Checklist

### Google OAuth
- [ ] สร้าง Google Cloud Project แล้ว
- [ ] เปิดใช้งาน Google+ API แล้ว
- [ ] สร้าง OAuth 2.0 credentials แล้ว
- [ ] เพิ่ม authorized origins และ redirect URIs แล้ว
- [ ] เพิ่ม GOOGLE_CLIENT_ID และ GOOGLE_CLIENT_SECRET ใน .env.local แล้ว
- [ ] ทดสอบ Google login สำเร็จ

### GitHub OAuth
- [ ] สร้าง GitHub OAuth App แล้ว
- [ ] ตั้งค่า callback URL แล้ว
- [ ] เพิ่ม GITHUB_CLIENT_ID และ GITHUB_CLIENT_SECRET ใน .env.local แล้ว
- [ ] ทดสอบ GitHub login สำเร็จ

### NextAuth Integration
- [ ] NextAuth configuration ถูกต้อง
- [ ] Environment variables ครบถ้วน
- [ ] Database schema รองรับ NextAuth
- [ ] Session management ทำงานได้

### Testing
- [ ] เข้าถึงหน้า signin ได้
- [ ] Google OAuth login ทำงาน
- [ ] GitHub OAuth login ทำงาน
- [ ] User data ถูกบันทึกใน database
- [ ] Session persistence ทำงาน
- [ ] Logout ทำงานถูกต้อง

## 🚨 Common Issues

### Google OAuth Issues
```
Error: redirect_uri_mismatch
Solution: ตรวจสอบ authorized redirect URIs ใน Google Console
- http://localhost:3000/api/auth/callback/google
```

### GitHub OAuth Issues
```
Error: The redirect_uri MUST match the registered callback URL
Solution: ตรวจสอบ Authorization callback URL ใน GitHub App settings
- http://localhost:3000/api/auth/callback/github
```

### NextAuth Issues
```
Error: [next-auth][error][CLIENT_FETCH_ERROR]
Solution: ตรวจสอบ NEXTAUTH_URL และ NEXTAUTH_SECRET
```

### Database Issues
```
Error: User creation failed
Solution: ตรวจสอบ Prisma schema และ database connection
```

## 🔧 Commands

```bash
# Quick OAuth setup validation
npm run task:oauth-test

# Manual testing
npm run dev
# เปิด browser ไปที่ http://localhost:3000/auth/signin

# ตรวจสอบ environment variables
npm run validate-env

# ดู NextAuth debug logs
DEBUG=next-auth* npm run dev
```

## 🔍 Testing Checklist

### Google OAuth Test
1. ไปที่ `/auth/signin`
2. คลิก "Sign in with Google"
3. เลือก Google account
4. ตรวจสอบว่า redirect กลับมาที่แอป
5. ตรวจสอบ user profile ใน database

### GitHub OAuth Test
1. ไปที่ `/auth/signin`
2. คลิก "Sign in with GitHub"
3. Authorize แอป (ถ้าเป็นครั้งแรก)
4. ตรวจสอบว่า redirect กลับมาที่แอป
5. ตรวจสอบ user profile ใน database

### Session Test
1. Login ด้วย OAuth provider
2. Refresh หน้า - ควรยัง login อยู่
3. ปิด browser แล้วเปิดใหม่ - ควรยัง login อยู่
4. Logout - ควร redirect ไปหน้า signin

## 📊 Expected Database Records

หลังจาก OAuth login สำเร็จ ควรมีข้อมูลใน tables:

```sql
-- Users table
SELECT id, email, name, image, provider FROM users;

-- Accounts table (OAuth connections)
SELECT userId, provider, providerAccountId FROM accounts;

-- Sessions table (active sessions)
SELECT userId, expires FROM sessions;
```

## 📚 References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [NextAuth.js Providers](https://next-auth.js.org/providers/)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 04: Production Monitoring](./04-production-monitoring.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)