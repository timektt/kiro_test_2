# Task 10: Analytics Dashboard

## 📋 Overview
**Priority:** Low  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Admin system, database with user activity data  

## 🎯 Objective
พัฒนา Analytics Dashboard สำหรับ admin เพื่อติดตามสถิติการใช้งาน, user engagement, และ performance metrics ของ community platform

## 📝 Task Details

### Step 1: Analytics Database Schema
1. **เพิ่ม Analytics Models**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model UserActivity {
     id        String   @id @default(cuid())
     userId    String
     action    String   // 'login', 'post_create', 'comment', 'like', etc.
     resource  String?  // resource type (post, comment, user)
     resourceId String? // resource ID
     metadata  Json?    // additional data
     ipAddress String?
     userAgent String?
     createdAt DateTime @default(now())
     
     // Relations
     user User @relation(fields: [userId], references: [id], onDelete: Cascade)
     
     @@index([userId, createdAt])
     @@index([action, createdAt])
     @@map("user_activities")
   }
   
   model SystemMetric {
     id        String   @id @default(cuid())
     name      String   // metric name
     value     Float    // metric value
     unit      String?  // unit of measurement
     category  String   // 'performance', 'usage', 'engagement'
     metadata  Json?    // additional context
     createdAt DateTime @default(now())
     
     @@index([name, createdAt])
     @@index([category, createdAt])
     @@map("system_metrics")
   }
   
   model DailyStats {
     id              String   @id @default(cuid())
     date            DateTime @unique @db.Date
     activeUsers     Int      @default(0)
     newUsers        Int      @default(0)
     totalPosts      Int      @default(0)
     totalComments   Int      @default(0)
     totalLikes      Int      @default(0)
     totalViews      Int      @default(0)
     avgSessionTime  Float?   // in minutes
     bounceRate      Float?   // percentage
     createdAt       DateTime @default(now())
     updatedAt       DateTime @updatedAt
     
     @@map("daily_stats")
   }
   
   model PageView {
     id        String   @id @default(cuid())
     userId    String?
     path      String
     title     String?
     referrer  String?
     duration  Int?     // time spent on page in seconds
     ipAddress String?
     userAgent String?
     createdAt DateTime @default(now())
     
     // Relations
     user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
     
     @@index([path, createdAt])
     @@index([userId, createdAt])
     @@map("page_views")
   }
   ```

2. **อัพเดท User Model**
   ```prisma
   model User {
     // ... existing fields
     
     // Analytics relations
     activities UserActivity[]
     pageViews  PageView[]
     
     // Stats fields
     lastActiveAt DateTime?
     totalPosts   Int       @default(0)
     totalLikes   Int       @default(0)
     totalViews   Int       @default(0)
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Step 2: Analytics Service Layer
1. **สร้าง Analytics Services**
   ```bash
   mkdir -p src/lib/analytics
   touch src/lib/analytics/tracker.ts
   touch src/lib/analytics/aggregator.ts
   touch src/lib/analytics/metrics.ts
   touch src/lib/analytics/reports.ts
   touch src/lib/analytics/dashboard-data.ts
   ```

2. **Event Tracking System**
   ```bash
   touch src/lib/analytics/events.ts
   touch src/lib/analytics/middleware.ts
   ```

3. **Data Processing**
   ```bash
   touch src/lib/analytics/processors/user-stats.ts
   touch src/lib/analytics/processors/content-stats.ts
   touch src/lib/analytics/processors/engagement-stats.ts
   ```

### Step 3: Analytics API Endpoints
1. **สร้าง API Routes**
   ```bash
   mkdir -p src/app/api/analytics
   touch src/app/api/analytics/dashboard/route.ts
   touch src/app/api/analytics/users/route.ts
   touch src/app/api/analytics/content/route.ts
   touch src/app/api/analytics/engagement/route.ts
   touch src/app/api/analytics/real-time/route.ts
   touch src/app/api/analytics/export/route.ts
   
   # Event tracking endpoints
   touch src/app/api/analytics/track/route.ts
   touch src/app/api/analytics/page-view/route.ts
   ```

2. **Scheduled Jobs**
   ```bash
   mkdir -p src/lib/jobs
   touch src/lib/jobs/daily-stats.ts
   touch src/lib/jobs/cleanup-analytics.ts
   ```

### Step 4: Dashboard Components
1. **Chart Components**
   ```bash
   mkdir -p src/components/analytics/charts
   touch src/components/analytics/charts/line-chart.tsx
   touch src/components/analytics/charts/bar-chart.tsx
   touch src/components/analytics/charts/pie-chart.tsx
   touch src/components/analytics/charts/area-chart.tsx
   touch src/components/analytics/charts/metric-card.tsx
   touch src/components/analytics/charts/trend-indicator.tsx
   ```

2. **Dashboard Widgets**
   ```bash
   mkdir -p src/components/analytics/widgets
   touch src/components/analytics/widgets/user-stats-widget.tsx
   touch src/components/analytics/widgets/content-stats-widget.tsx
   touch src/components/analytics/widgets/engagement-widget.tsx
   touch src/components/analytics/widgets/real-time-widget.tsx
   touch src/components/analytics/widgets/top-content-widget.tsx
   touch src/components/analytics/widgets/user-activity-widget.tsx
   ```

3. **Dashboard Layout**
   ```bash
   touch src/components/analytics/dashboard-layout.tsx
   touch src/components/analytics/dashboard-header.tsx
   touch src/components/analytics/dashboard-sidebar.tsx
   touch src/components/analytics/dashboard-grid.tsx
   ```

4. **Filters and Controls**
   ```bash
   touch src/components/analytics/date-range-picker.tsx
   touch src/components/analytics/metric-selector.tsx
   touch src/components/analytics/dashboard-filters.tsx
   touch src/components/analytics/export-controls.tsx
   ```

### Step 5: Dashboard Pages
1. **Main Analytics Pages**
   ```bash
   mkdir -p src/app/admin/analytics
   touch src/app/admin/analytics/page.tsx
   touch src/app/admin/analytics/users/page.tsx
   touch src/app/admin/analytics/content/page.tsx
   touch src/app/admin/analytics/engagement/page.tsx
   touch src/app/admin/analytics/real-time/page.tsx
   ```

2. **Report Pages**
   ```bash
   mkdir -p src/app/admin/analytics/reports
   touch src/app/admin/analytics/reports/page.tsx
   touch src/app/admin/analytics/reports/user-report/page.tsx
   touch src/app/admin/analytics/reports/content-report/page.tsx
   touch src/app/admin/analytics/reports/custom/page.tsx
   ```

### Step 6: Real-time Analytics
1. **WebSocket Integration**
   ```bash
   touch src/lib/analytics/real-time.ts
   touch src/lib/analytics/websocket-handler.ts
   ```

2. **Real-time Components**
   ```bash
   touch src/components/analytics/real-time/live-users.tsx
   touch src/components/analytics/real-time/live-activity.tsx
   touch src/components/analytics/real-time/live-metrics.tsx
   ```

### Step 7: Data Visualization Libraries
1. **Install Chart Libraries**
   ```bash
   npm install recharts @tremor/react
   npm install date-fns
   npm install @types/d3
   ```

2. **Chart Configuration**
   ```bash
   touch src/lib/analytics/chart-config.ts
   touch src/lib/analytics/chart-utils.ts
   ```

### Step 8: Event Tracking Integration
1. **Client-side Tracking**
   ```bash
   touch src/lib/analytics/client-tracker.ts
   touch src/hooks/use-analytics.ts
   ```

2. **Server-side Tracking**
   ```bash
   touch src/lib/analytics/server-tracker.ts
   touch src/middleware/analytics.ts
   ```

3. **Integration with Existing Features**
   ```bash
   # อัพเดท existing components เพื่อ track events
   # src/components/posts/post-card.tsx
   # src/components/auth/login-form.tsx
   # src/components/profile/profile-page.tsx
   ```

## ✅ Checklist

### Database Schema
- [ ] เพิ่ม UserActivity model แล้ว
- [ ] เพิ่ม SystemMetric model แล้ว
- [ ] เพิ่ม DailyStats model แล้ว
- [ ] เพิ่ม PageView model แล้ว
- [ ] อัพเดท User model แล้ว
- [ ] รัน migration สำเร็จ

### Analytics Services
- [ ] สร้าง analytics services แล้ว
- [ ] สร้าง event tracking system แล้ว
- [ ] สร้าง data processors แล้ว
- [ ] ทดสอบ analytics services สำเร็จ

### API Endpoints
- [ ] สร้าง analytics API endpoints แล้ว
- [ ] สร้าง tracking endpoints แล้ว
- [ ] สร้าง scheduled jobs แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Dashboard Components
- [ ] สร้าง chart components แล้ว
- [ ] สร้าง dashboard widgets แล้ว
- [ ] สร้าง dashboard layout แล้ว
- [ ] สร้าง filters และ controls แล้ว
- [ ] ทดสอบ components สำเร็จ

### Dashboard Pages
- [ ] สร้าง main analytics pages แล้ว
- [ ] สร้าง report pages แล้ว
- [ ] ทดสอบ dashboard navigation สำเร็จ

### Real-time Analytics
- [ ] ตั้งค่า WebSocket integration แล้ว
- [ ] สร้าง real-time components แล้ว
- [ ] ทดสอบ real-time functionality สำเร็จ

### Event Tracking
- [ ] ตั้งค่า client-side tracking แล้ว
- [ ] ตั้งค่า server-side tracking แล้ว
- [ ] อัพเดท existing features แล้ว
- [ ] ทดสอบ event tracking สำเร็จ

## 🚨 Common Issues

### Performance Issues
```bash
# Error: Slow analytics queries
# Solution: Add proper indexes และ implement data aggregation
```

### Data Accuracy Issues
```bash
# Error: Inconsistent analytics data
# Solution: Implement data validation และ cleanup jobs
```

### Real-time Issues
```bash
# Error: WebSocket connection problems
# Solution: Implement proper error handling และ reconnection logic
```

### Chart Rendering Issues
```bash
# Error: Charts not displaying correctly
# Solution: Check data format และ chart configuration
```

## 🔧 Commands

```bash
# Quick analytics setup
npm run task:analytics-setup

# Manual setup steps
npm install recharts @tremor/react date-fns
npx prisma db push
npx prisma generate
npm run dev

# Run analytics jobs
npm run job:daily-stats
npm run job:cleanup-analytics

# Test analytics
npm run test:analytics

# Generate analytics report
npm run analytics:report
```

## 📊 Dashboard Metrics

### User Metrics
- **Active Users**: Daily, Weekly, Monthly active users
- **New Users**: User registration trends
- **User Retention**: Cohort analysis
- **User Engagement**: Session duration, page views
- **User Demographics**: MBTI distribution, age groups

### Content Metrics
- **Post Statistics**: Total posts, posts per day
- **Comment Statistics**: Comments per post, engagement rate
- **Like Statistics**: Likes per post, like trends
- **Popular Content**: Top posts, trending topics
- **Content Performance**: Views, shares, engagement

### Engagement Metrics
- **Interaction Rates**: Like rate, comment rate, share rate
- **User Activity**: Most active users, activity patterns
- **Content Consumption**: Reading time, bounce rate
- **Social Features**: Follow relationships, community growth

### System Metrics
- **Performance**: Page load times, API response times
- **Errors**: Error rates, error types
- **Usage Patterns**: Peak hours, popular pages
- **Technical Health**: Database performance, server metrics

## 📈 Advanced Analytics Features

### Cohort Analysis
```typescript
// Track user retention over time
const cohortAnalysis = {
  newUsers: [], // users who joined in specific period
  retention: [], // percentage who returned
  engagement: [] // activity levels over time
};
```

### Funnel Analysis
```typescript
// Track user journey through key actions
const funnelSteps = [
  'registration',
  'profile_completion',
  'first_post',
  'first_comment',
  'first_like'
];
```

### A/B Testing Integration
```typescript
// Track experiment results
const experimentTracking = {
  experimentId: 'string',
  variant: 'A' | 'B',
  conversionRate: 'number',
  significance: 'number'
};
```

### Custom Events
```typescript
// Track custom business events
const customEvents = {
  'mbti_test_completed': { userId, testResult, duration },
  'profile_updated': { userId, fieldsChanged },
  'post_shared': { postId, shareMethod, userId }
};
```

## 🎨 Dashboard Design

### Layout Structure
```
┌─────────────────────────────────────────┐
│ Header (Date Range, Export, Refresh)   │
├─────────────────────────────────────────┤
│ Key Metrics Cards (4 columns)          │
├─────────────────────────────────────────┤
│ Main Charts (2 columns)                │
│ ├─ User Growth    ├─ Content Stats     │
├─────────────────────────────────────────┤
│ Secondary Charts (3 columns)           │
│ ├─ Engagement ├─ Popular ├─ Real-time │
├─────────────────────────────────────────┤
│ Data Tables (Recent Activity, Top Users)│
└─────────────────────────────────────────┘
```

### Color Scheme
```css
/* Analytics Dashboard Colors */
:root {
  --analytics-primary: #3b82f6;
  --analytics-success: #10b981;
  --analytics-warning: #f59e0b;
  --analytics-danger: #ef4444;
  --analytics-info: #06b6d4;
  --analytics-neutral: #6b7280;
}
```

### Responsive Design
- **Desktop**: Full dashboard with all widgets
- **Tablet**: Stacked layout with essential metrics
- **Mobile**: Simplified view with key metrics only

## 🔍 Testing Analytics

### Manual Testing
1. **Dashboard Loading**
   - เข้าสู่ analytics dashboard
   - ทดสอบ date range selection
   - ทดสอบ metric filtering

2. **Data Accuracy**
   - สร้าง test data
   - ตรวจสอบ metrics calculation
   - ทดสอบ real-time updates

3. **Export Functionality**
   - ทดสอบ data export
   - ทดสอบ report generation
   - ทดสอบ scheduled reports

### Automated Testing
```bash
# Unit tests
npm run test:analytics-services
npm run test:dashboard-components

# API tests
npm run test:analytics-api

# Integration tests
npm run test:analytics-integration

# Performance tests
npm run test:analytics-performance
```

## 🚀 Performance Optimization

### Database Optimization
```sql
-- Indexes for analytics queries
CREATE INDEX user_activities_user_date_idx ON user_activities(user_id, created_at);
CREATE INDEX user_activities_action_date_idx ON user_activities(action, created_at);
CREATE INDEX page_views_path_date_idx ON page_views(path, created_at);
CREATE INDEX daily_stats_date_idx ON daily_stats(date);
```

### Caching Strategy
```typescript
// Cache dashboard data
const dashboardData = await redis.get(`dashboard:${dateRange}`) ||
  await generateDashboardData(dateRange);

// Cache expensive calculations
const userRetention = await redis.get('user_retention') ||
  await calculateUserRetention();
```

### Data Aggregation
```typescript
// Pre-aggregate daily stats
const aggregateDailyStats = async () => {
  const stats = await calculateDailyMetrics();
  await prisma.dailyStats.upsert({
    where: { date: today },
    update: stats,
    create: { date: today, ...stats }
  });
};
```

## 📱 Mobile Analytics

### Mobile-Specific Metrics
- **Device Types**: Mobile vs Desktop usage
- **Screen Sizes**: Popular screen resolutions
- **Touch Interactions**: Tap patterns, swipe behavior
- **Mobile Performance**: Load times on mobile devices

### Mobile Dashboard
- **Simplified Layout**: Essential metrics only
- **Touch-Friendly**: Large buttons and touch targets
- **Offline Support**: Cache key metrics for offline viewing
- **Push Notifications**: Alert for important metric changes

## 🔐 Analytics Privacy

### Data Privacy
- **Anonymization**: Remove PII from analytics data
- **Consent Management**: Respect user privacy preferences
- **Data Retention**: Automatic cleanup of old analytics data
- **GDPR Compliance**: Right to be forgotten implementation

### Security
- **Access Control**: Role-based access to analytics
- **Data Encryption**: Encrypt sensitive analytics data
- **Audit Logging**: Track who accessed what data
- **Rate Limiting**: Prevent analytics API abuse

## 📚 References

- [Google Analytics Best Practices](https://support.google.com/analytics/)
- [Dashboard Design Principles](https://www.klipfolio.com/resources/articles/what-is-a-dashboard)
- [Data Visualization Guidelines](https://www.tableau.com/learn/articles/data-visualization)
- [Analytics Privacy Guidelines](https://www.privacypolicies.com/blog/privacy-policy-analytics/)
- [Recharts Documentation](https://recharts.org/)
- [Tremor Documentation](https://www.tremor.so/)

## 🎯 Success Metrics

### Implementation Success
- [ ] Dashboard loads within 2 seconds
- [ ] All key metrics display correctly
- [ ] Real-time updates work properly
- [ ] Export functionality works
- [ ] Mobile responsive design

### Business Value
- [ ] Admin can track user growth
- [ ] Content performance is measurable
- [ ] User engagement insights available
- [ ] System health monitoring active
- [ ] Data-driven decisions possible

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)  
**Next:** All tasks completed! 🎉