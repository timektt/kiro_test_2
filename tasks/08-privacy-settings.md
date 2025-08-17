# Task 08: Privacy Settings

## 📋 Overview
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Prerequisites:** User authentication, basic profile functionality  

## 🎯 Objective
พัฒนาระบบการตั้งค่าความเป็นส่วนตัวที่ให้ผู้ใช้สามารถควบคุมการมองเห็นข้อมูลส่วนตัว, โพสต์, และการโต้ตอบของตนเองได้

## 📝 Task Details

### Step 1: Database Schema Update
1. **เพิ่ม Privacy Models ใน Prisma Schema**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model PrivacySetting {
     id     String @id @default(cuid())
     userId String @unique
     
     // Profile visibility
     profileVisibility    ProfileVisibility @default(PUBLIC)
     showEmail           Boolean           @default(false)
     showMBTI            Boolean           @default(true)
     showBio             Boolean           @default(true)
     showJoinDate        Boolean           @default(true)
     showFollowerCount   Boolean           @default(true)
     showFollowingCount  Boolean           @default(true)
     
     // Post visibility
     defaultPostVisibility PostVisibility @default(PUBLIC)
     allowComments        Boolean         @default(true)
     allowLikes           Boolean         @default(true)
     allowShares          Boolean         @default(true)
     
     // Interaction settings
     allowDirectMessages  Boolean @default(true)
     allowMentions        Boolean @default(true)
     allowTagging         Boolean @default(true)
     
     // Notification privacy
     showOnlineStatus     Boolean @default(true)
     showLastSeen         Boolean @default(true)
     showReadReceipts     Boolean @default(true)
     
     // Search and discovery
     allowSearchByEmail   Boolean @default(false)
     allowSearchByPhone   Boolean @default(false)
     showInSuggestions    Boolean @default(true)
     allowIndexing        Boolean @default(true)
     
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     // Relations
     user User @relation(fields: [userId], references: [id], onDelete: Cascade)
     
     @@map("privacy_settings")
   }
   
   model BlockedUser {
     id          String   @id @default(cuid())
     userId      String   // User who blocked
     blockedUserId String // User who was blocked
     reason      String?
     createdAt   DateTime @default(now())
     
     // Relations
     user        User @relation("UserBlocks", fields: [userId], references: [id], onDelete: Cascade)
     blockedUser User @relation("UserBlocked", fields: [blockedUserId], references: [id], onDelete: Cascade)
     
     @@unique([userId, blockedUserId])
     @@map("blocked_users")
   }
   
   enum ProfileVisibility {
     PUBLIC
     FOLLOWERS_ONLY
     PRIVATE
   }
   
   enum PostVisibility {
     PUBLIC
     FOLLOWERS_ONLY
     PRIVATE
     CUSTOM
   }
   ```

2. **อัพเดท User และ Post Models**
   ```prisma
   model User {
     // ... existing fields
     
     // Privacy relations
     privacySettings PrivacySetting?
     blockedUsers    BlockedUser[] @relation("UserBlocks")
     blockedBy       BlockedUser[] @relation("UserBlocked")
   }
   
   model Post {
     // ... existing fields
     visibility PostVisibility @default(PUBLIC)
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Step 2: Privacy API Endpoints
1. **สร้าง Privacy API Routes**
   ```bash
   mkdir -p src/app/api/privacy
   touch src/app/api/privacy/settings/route.ts
   touch src/app/api/privacy/block/route.ts
   touch src/app/api/privacy/unblock/route.ts
   touch src/app/api/privacy/blocked-users/route.ts
   ```

2. **Privacy Service Layer**
   ```bash
   touch src/lib/services/privacy.ts
   ```

3. **Privacy Middleware**
   ```bash
   touch src/lib/middleware/privacy.ts
   ```

### Step 3: Privacy Components
1. **สร้าง Privacy Settings Components**
   ```bash
   mkdir -p src/components/privacy
   touch src/components/privacy/privacy-settings-form.tsx
   touch src/components/privacy/profile-visibility.tsx
   touch src/components/privacy/post-visibility.tsx
   touch src/components/privacy/interaction-settings.tsx
   touch src/components/privacy/blocked-users-list.tsx
   touch src/components/privacy/block-user-modal.tsx
   ```

2. **Privacy Controls**
   ```bash
   touch src/components/privacy/visibility-selector.tsx
   touch src/components/privacy/privacy-toggle.tsx
   touch src/components/privacy/privacy-info.tsx
   ```

### Step 4: Privacy Pages
1. **สร้าง Privacy Settings Pages**
   ```bash
   mkdir -p src/app/settings/privacy
   touch src/app/settings/privacy/page.tsx
   touch src/app/settings/privacy/blocked-users/page.tsx
   touch src/app/settings/privacy/data-export/page.tsx
   touch src/app/settings/privacy/data-deletion/page.tsx
   ```

2. **Privacy Policy Pages**
   ```bash
   mkdir -p src/app/privacy
   touch src/app/privacy/policy/page.tsx
   touch src/app/privacy/terms/page.tsx
   ```

### Step 5: Privacy Enforcement
1. **Content Filtering**
   ```bash
   touch src/lib/utils/privacy-filter.ts
   touch src/lib/utils/visibility-checker.ts
   ```

2. **API Route Protection**
   ```bash
   # อัพเดท existing API routes เพื่อใช้ privacy middleware
   # src/app/api/posts/route.ts
   # src/app/api/users/[id]/route.ts
   # src/app/api/profile/[id]/route.ts
   ```

3. **Frontend Privacy Guards**
   ```bash
   touch src/components/guards/privacy-guard.tsx
   touch src/hooks/use-privacy.ts
   ```

### Step 6: Data Export & Deletion
1. **Data Export System**
   ```bash
   mkdir -p src/lib/data-export
   touch src/lib/data-export/user-data.ts
   touch src/lib/data-export/export-service.ts
   touch src/app/api/privacy/export/route.ts
   ```

2. **Data Deletion System**
   ```bash
   touch src/lib/data-deletion/user-deletion.ts
   touch src/app/api/privacy/delete-account/route.ts
   ```

## ✅ Checklist

### Database Schema
- [ ] เพิ่ม PrivacySetting model แล้ว
- [ ] เพิ่ม BlockedUser model แล้ว
- [ ] เพิ่ม privacy enums แล้ว
- [ ] อัพเดท User และ Post models แล้ว
- [ ] รัน migration สำเร็จ

### API Endpoints
- [ ] สร้าง privacy settings API แล้ว
- [ ] สร้าง block/unblock API แล้ว
- [ ] สร้าง blocked users API แล้ว
- [ ] สร้าง privacy service layer แล้ว
- [ ] สร้าง privacy middleware แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Frontend Components
- [ ] สร้าง privacy settings form แล้ว
- [ ] สร้าง profile visibility controls แล้ว
- [ ] สร้าง post visibility controls แล้ว
- [ ] สร้าง interaction settings แล้ว
- [ ] สร้าง blocked users management แล้ว
- [ ] สร้าง block user modal แล้ว

### Privacy Pages
- [ ] สร้าง privacy settings page แล้ว
- [ ] สร้าง blocked users page แล้ว
- [ ] สร้าง data export page แล้ว
- [ ] สร้าง data deletion page แล้ว
- [ ] สร้าง privacy policy page แล้ว

### Privacy Enforcement
- [ ] สร้าง content filtering utils แล้ว
- [ ] สร้าง visibility checker แล้ว
- [ ] อัพเดท API routes ด้วย privacy protection แล้ว
- [ ] สร้าง privacy guards แล้ว
- [ ] สร้าง privacy hooks แล้ว

### Data Management
- [ ] สร้าง data export system แล้ว
- [ ] สร้าง data deletion system แล้ว
- [ ] ทดสอบ data export สำเร็จ
- [ ] ทดสอบ account deletion สำเร็จ

## 🚨 Common Issues

### Privacy Enforcement Issues
```bash
# Error: Privacy settings not applied
# Solution: ตรวจสอบ middleware order และ privacy checks
```

### Data Export Issues
```bash
# Error: Data export timeout
# Solution: Implement chunked export และ background processing
```

### Blocking System Issues
```bash
# Error: Blocked users still visible
# Solution: ตรวจสอบ query filters และ privacy middleware
```

### Performance Issues
```bash
# Error: Slow privacy checks
# Solution: Implement caching และ optimize database queries
```

## 🔧 Commands

```bash
# Quick privacy setup
npm run task:privacy-setup

# Manual setup steps
npx prisma db push
npx prisma generate
npm run dev

# Test privacy functionality
npm run test:privacy

# Export user data
curl -X POST http://localhost:3000/api/privacy/export -H "Authorization: Bearer token"

# Test privacy enforcement
npm run test:privacy-enforcement
```

## 🔒 Privacy Features

### Profile Privacy
- **Profile Visibility**: Public, Followers Only, Private
- **Information Control**: Show/hide email, MBTI, bio, join date
- **Statistics Control**: Show/hide follower/following counts
- **Search Privacy**: Control discoverability in search

### Content Privacy
- **Post Visibility**: Public, Followers Only, Private, Custom
- **Interaction Control**: Allow/disallow comments, likes, shares
- **Default Settings**: Set default visibility for new posts
- **Retroactive Changes**: Apply privacy changes to existing content

### Communication Privacy
- **Direct Messages**: Allow/block DMs from strangers
- **Mentions**: Control who can mention you
- **Tagging**: Control who can tag you in posts
- **Notifications**: Control notification privacy

### Blocking System
- **User Blocking**: Block specific users completely
- **Content Filtering**: Hide blocked users' content
- **Interaction Prevention**: Prevent all interactions with blocked users
- **Block Management**: View and manage blocked users list

## 📊 Privacy Analytics

### Privacy Metrics
- **Privacy Adoption**: Percentage of users using privacy features
- **Visibility Distribution**: Distribution of profile/post visibility settings
- **Blocking Activity**: Number of blocks per day/week
- **Data Requests**: Number of data export/deletion requests

### Compliance Tracking
- **GDPR Compliance**: Track data processing consent
- **Data Retention**: Monitor data retention periods
- **Deletion Requests**: Track account deletion requests
- **Export Requests**: Track data export requests

## 🔍 Testing Privacy System

### Manual Testing
1. **Profile Privacy**
   - ตั้งค่า profile เป็น private
   - ทดสอบการมองเห็นจาก users อื่น
   - ทดสอบ search visibility

2. **Content Privacy**
   - สร้างโพสต์ด้วย visibility ต่างๆ
   - ทดสอบการมองเห็นของ followers/non-followers
   - ทดสอบ interaction controls

3. **Blocking System**
   - Block user และทดสอบการมองเห็น
   - ทดสอบ interaction prevention
   - ทดสอบ unblock functionality

### Automated Testing
```bash
# Unit tests
npm run test:privacy-components

# API tests
npm run test:privacy-api

# Privacy enforcement tests
npm run test:privacy-enforcement

# Data export tests
npm run test:data-export
```

## 📈 Privacy Best Practices

### Security Guidelines
- **Default Privacy**: Use privacy-friendly defaults
- **Clear Controls**: Make privacy controls easy to find and use
- **Granular Options**: Provide detailed privacy options
- **Regular Audits**: Regularly audit privacy implementations

### User Experience
- **Privacy Education**: Educate users about privacy options
- **Easy Access**: Make privacy settings easily accessible
- **Clear Language**: Use clear, non-technical language
- **Visual Indicators**: Show privacy status clearly

### Compliance
- **GDPR Compliance**: Implement GDPR requirements
- **Data Minimization**: Collect only necessary data
- **Consent Management**: Manage user consent properly
- **Right to be Forgotten**: Implement data deletion

## 🔍 Privacy Enforcement Examples

### API Route Protection
```typescript
// Example: Protected user profile endpoint
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const targetUser = await getUserById(params.id);
  
  // Check if user is blocked
  if (await isUserBlocked(currentUser.id, targetUser.id)) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Apply privacy filters
  const filteredProfile = await applyPrivacyFilters(targetUser, currentUser);
  
  return NextResponse.json(filteredProfile);
}
```

### Content Filtering
```typescript
// Example: Filter posts based on privacy settings
const visiblePosts = await prisma.post.findMany({
  where: {
    AND: [
      // Basic filters
      { deletedAt: null },
      
      // Privacy filters
      {
        OR: [
          { visibility: 'PUBLIC' },
          {
            AND: [
              { visibility: 'FOLLOWERS_ONLY' },
              { author: { followers: { some: { followerId: currentUserId } } } }
            ]
          },
          { authorId: currentUserId } // Own posts
        ]
      },
      
      // Blocked users filter
      {
        author: {
          blockedBy: {
            none: { userId: currentUserId }
          }
        }
      }
    ]
  }
});
```

## 📚 References

- [GDPR Compliance Guide](https://gdpr.eu/)
- [Privacy by Design Principles](https://www.ipc.on.ca/wp-content/uploads/resources/7foundationalprinciples.pdf)
- [User Privacy Best Practices](https://developers.google.com/privacy/best-practices)
- [Data Protection Guidelines](https://ico.org.uk/for-organisations/guide-to-data-protection/)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 09: Tags and Categories](./09-tags-categories.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)