# Task 07: Email Notification System

## 📋 Overview
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic app functionality, SMTP configuration  

## 🎯 Objective
พัฒนาระบบการแจ้งเตือนทาง email สำหรับกิจกรรมต่างๆ ในแพลตฟอร์ม เช่น การได้รับ like, comment, follow และการแจ้งเตือนระบบ

## 📝 Task Details

### Step 1: Email Service Setup
1. **ติดตั้ง Email Libraries**
   ```bash
   npm install nodemailer @types/nodemailer
   npm install react-email @react-email/components
   npm install handlebars
   ```

2. **ตั้งค่า SMTP Configuration**
   ```env
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   EMAIL_FROM_NAME="Community Platform"
   
   # Email Settings
   ENABLE_EMAIL_NOTIFICATIONS="true"
   EMAIL_QUEUE_ENABLED="true"
   ```

3. **สร้าง Email Service**
   ```bash
   mkdir -p src/lib/email
   touch src/lib/email/config.ts
   touch src/lib/email/service.ts
   touch src/lib/email/queue.ts
   ```

### Step 2: Database Schema Update
1. **เพิ่ม Email Notification Models**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model EmailNotification {
     id          String               @id @default(cuid())
     userId      String
     type        EmailNotificationType
     subject     String
     content     String
     templateId  String?
     data        Json?
     status      EmailStatus          @default(PENDING)
     sentAt      DateTime?
     failedAt    DateTime?
     retryCount  Int                  @default(0)
     error       String?
     createdAt   DateTime             @default(now())
     updatedAt   DateTime             @updatedAt
     
     // Relations
     user User @relation(fields: [userId], references: [id], onDelete: Cascade)
     
     @@map("email_notifications")
   }
   
   model EmailPreference {
     id                    String  @id @default(cuid())
     userId                String  @unique
     enableEmailNotifications Boolean @default(true)
     
     // Notification preferences
     notifyOnLike          Boolean @default(true)
     notifyOnComment       Boolean @default(true)
     notifyOnFollow        Boolean @default(true)
     notifyOnMention       Boolean @default(true)
     notifyOnPost          Boolean @default(false)
     notifyWeeklyDigest    Boolean @default(true)
     notifySystemUpdates   Boolean @default(true)
     
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     // Relations
     user User @relation(fields: [userId], references: [id], onDelete: Cascade)
     
     @@map("email_preferences")
   }
   
   enum EmailNotificationType {
     LIKE
     COMMENT
     FOLLOW
     MENTION
     POST
     WEEKLY_DIGEST
     SYSTEM_UPDATE
     WELCOME
     PASSWORD_RESET
   }
   
   enum EmailStatus {
     PENDING
     SENT
     FAILED
     CANCELLED
   }
   ```

2. **อัพเดท User Model**
   ```prisma
   model User {
     // ... existing fields
     
     // Email relations
     emailNotifications EmailNotification[]
     emailPreferences   EmailPreference?
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Step 3: Email Templates
1. **สร้าง Email Templates**
   ```bash
   mkdir -p src/emails
   touch src/emails/welcome.tsx
   touch src/emails/like-notification.tsx
   touch src/emails/comment-notification.tsx
   touch src/emails/follow-notification.tsx
   touch src/emails/weekly-digest.tsx
   touch src/emails/password-reset.tsx
   ```

2. **Base Email Template**
   ```bash
   touch src/emails/base-template.tsx
   touch src/emails/components/header.tsx
   touch src/emails/components/footer.tsx
   touch src/emails/components/button.tsx
   ```

3. **Email Template Utils**
   ```bash
   touch src/lib/email/templates.ts
   touch src/lib/email/render.ts
   ```

### Step 4: Email API Endpoints
1. **สร้าง Email API Routes**
   ```bash
   mkdir -p src/app/api/email
   touch src/app/api/email/send/route.ts
   touch src/app/api/email/preferences/route.ts
   touch src/app/api/email/unsubscribe/route.ts
   touch src/app/api/email/test/route.ts
   ```

2. **Email Webhook Handlers**
   ```bash
   touch src/app/api/email/webhook/route.ts
   ```

### Step 5: Email Queue System
1. **Email Queue Implementation**
   ```bash
   # ใช้ Redis สำหรับ queue (ถ้ามี) หรือ database queue
   touch src/lib/email/queue-processor.ts
   touch src/lib/email/scheduler.ts
   ```

2. **Background Job Processing**
   ```bash
   touch src/lib/jobs/email-processor.ts
   touch src/lib/jobs/digest-generator.ts
   ```

### Step 6: Frontend Email Preferences
1. **Email Preferences Components**
   ```bash
   mkdir -p src/components/email
   touch src/components/email/preferences-form.tsx
   touch src/components/email/notification-settings.tsx
   touch src/components/email/unsubscribe-form.tsx
   ```

2. **Email Preferences Pages**
   ```bash
   mkdir -p src/app/settings/email
   touch src/app/settings/email/page.tsx
   touch src/app/unsubscribe/page.tsx
   ```

### Step 7: Email Triggers Integration
1. **Notification Triggers**
   ```bash
   # อัพเดท existing API routes เพื่อส่ง email notifications
   # src/app/api/posts/[id]/like/route.ts
   # src/app/api/posts/[id]/comments/route.ts
   # src/app/api/users/[id]/follow/route.ts
   ```

2. **Email Service Integration**
   ```bash
   touch src/lib/services/notification.ts
   ```

## ✅ Checklist

### Email Service Setup
- [ ] ติดตั้ง email libraries แล้ว
- [ ] ตั้งค่า SMTP configuration แล้ว
- [ ] สร้าง email service แล้ว
- [ ] ทดสอบ SMTP connection สำเร็จ

### Database Schema
- [ ] เพิ่ม EmailNotification model แล้ว
- [ ] เพิ่ม EmailPreference model แล้ว
- [ ] เพิ่ม email enums แล้ว
- [ ] อัพเดท User model relations แล้ว
- [ ] รัน migration สำเร็จ

### Email Templates
- [ ] สร้าง base email template แล้ว
- [ ] สร้าง welcome email template แล้ว
- [ ] สร้าง notification email templates แล้ว
- [ ] สร้าง weekly digest template แล้ว
- [ ] สร้าง password reset template แล้ว
- [ ] ทดสอบ template rendering สำเร็จ

### API Endpoints
- [ ] สร้าง email send API แล้ว
- [ ] สร้าง preferences API แล้ว
- [ ] สร้าง unsubscribe API แล้ว
- [ ] สร้าง test email API แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Email Queue
- [ ] สร้าง email queue system แล้ว
- [ ] สร้าง background job processor แล้ว
- [ ] สร้าง email scheduler แล้ว
- [ ] ทดสอบ queue processing สำเร็จ

### Frontend Integration
- [ ] สร้าง email preferences form แล้ว
- [ ] สร้าง notification settings แล้ว
- [ ] สร้าง unsubscribe page แล้ว
- [ ] เพิ่ม email settings ใน user profile แล้ว

### Email Triggers
- [ ] เพิ่ม email trigger สำหรับ likes แล้ว
- [ ] เพิ่ม email trigger สำหรับ comments แล้ว
- [ ] เพิ่ม email trigger สำหรับ follows แล้ว
- [ ] เพิ่ม welcome email trigger แล้ว
- [ ] ทดสอบ email notifications สำเร็จ

## 🚨 Common Issues

### SMTP Configuration Issues
```bash
# Error: SMTP authentication failed
# Solution: ตรวจสอบ credentials และ app passwords
# สำหรับ Gmail ใช้ App Passwords แทน account password
```

### Email Delivery Issues
```bash
# Error: Emails going to spam
# Solution: ตั้งค่า SPF, DKIM, DMARC records
# ใช้ verified domain สำหรับ FROM address
```

### Template Rendering Issues
```bash
# Error: Email template not rendering
# Solution: ตรวจสอบ React Email components และ data binding
```

### Queue Processing Issues
```bash
# Error: Email queue not processing
# Solution: ตรวจสอบ background job runner และ database connections
```

## 🔧 Commands

```bash
# Quick email setup
npm run task:email-setup

# Manual setup steps
npm install nodemailer react-email
npx prisma db push
npx prisma generate

# Test email functionality
npm run test:email

# Send test email
curl -X POST http://localhost:3000/api/email/test -H "Content-Type: application/json" -d '{"to":"test@example.com"}'

# Process email queue
npm run process:email-queue

# Generate weekly digest
npm run generate:weekly-digest
```

## 📧 Email Types

### Notification Emails
- **Like Notification**: เมื่อโพสต์ได้รับ like
- **Comment Notification**: เมื่อโพสต์ได้รับ comment
- **Follow Notification**: เมื่อมีคนติดตาม
- **Mention Notification**: เมื่อถูก mention ในโพสต์หรือ comment

### System Emails
- **Welcome Email**: เมื่อสมัครสมาชิกใหม่
- **Password Reset**: เมื่อขอรีเซ็ตรหัสผ่าน
- **Email Verification**: เมื่อต้องยืนยัน email
- **Account Security**: เมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่

### Digest Emails
- **Weekly Digest**: สรุปกิจกรรมประจำสัปดาห์
- **Monthly Summary**: สรุปกิจกรรมประจำเดือน
- **Trending Posts**: โพสต์ยอดนิยมของสัปดาห์

## 🎨 Email Template Features

### Design Elements
- **Responsive Design**: ใช้งานได้บนทุกอุปกรณ์
- **Brand Consistency**: ใช้สีและ font ตาม brand
- **Dark Mode Support**: รองรับ dark mode email clients
- **Accessibility**: รองรับ screen readers

### Interactive Elements
- **CTA Buttons**: ปุ่มสำหรับ call-to-action
- **Unsubscribe Link**: ลิงก์ยกเลิกการสมัครรับ
- **Preference Center**: ลิงก์ไปยังการตั้งค่า email
- **Social Links**: ลิงก์ไปยัง social media

## 📊 Email Analytics

### Metrics to Track
- **Delivery Rate**: อัตราการส่งสำเร็จ
- **Open Rate**: อัตราการเปิดอ่าน
- **Click Rate**: อัตราการคลิกลิงก์
- **Unsubscribe Rate**: อัตราการยกเลิกสมัครรับ
- **Bounce Rate**: อัตราการ bounce

### Email Performance
- **Send Volume**: จำนวน email ที่ส่งต่อวัน
- **Queue Length**: จำนวน email ที่รอส่ง
- **Processing Time**: เวลาในการประมวลผล email
- **Error Rate**: อัตราข้อผิดพลาดในการส่ง

## 🔍 Testing Email System

### Manual Testing
1. **SMTP Connection**
   ```bash
   # ทดสอบการเชื่อมต่อ SMTP
   npm run test:smtp
   ```

2. **Template Rendering**
   ```bash
   # ทดสอบการ render template
   npm run test:templates
   ```

3. **Email Delivery**
   ```bash
   # ส่ง test email
   curl -X POST http://localhost:3000/api/email/test
   ```

### Automated Testing
```bash
# Unit tests
npm run test:email-service

# Integration tests
npm run test:email-api

# Template tests
npm run test:email-templates
```

## 📈 Email Best Practices

### Content Guidelines
- **Clear Subject Lines**: ใช้ subject ที่ชัดเจนและน่าสนใจ
- **Personalization**: ใช้ชื่อผู้รับและข้อมูลส่วนตัว
- **Concise Content**: เนื้อหากระชับและตรงประเด็น
- **Clear CTA**: ปุ่ม call-to-action ที่ชัดเจน

### Technical Guidelines
- **Mobile Responsive**: ออกแบบให้ใช้งานได้บนมือถือ
- **Fast Loading**: ใช้รูปภาพที่เหมาะสมและ optimize
- **Fallback Text**: มี alt text สำหรับรูปภาพ
- **Testing**: ทดสอบใน email clients ต่างๆ

## 📚 References

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [React Email Documentation](https://react.email/docs/introduction)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)
- [SMTP Configuration Guide](https://nodemailer.com/smtp/)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 08: Privacy Settings](./08-privacy-settings.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)