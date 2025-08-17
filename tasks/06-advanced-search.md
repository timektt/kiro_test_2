# Task 06: Advanced Search Feature

## 📋 Overview
**Priority:** Medium  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic app functionality, database with content  

## 🎯 Objective
พัฒนาระบบค้นหาขั้นสูงที่ให้ผู้ใช้สามารถค้นหาผู้ใช้, โพสต์, และเนื้อหาต่างๆ ได้อย่างมีประสิทธิภาพ พร้อมฟีเจอร์ filter และ sorting

## 📝 Task Details

### Step 1: Database Optimization for Search
1. **เพิ่ม Full-text Search Indexes**
   ```sql
   -- สร้างไฟล์ SQL สำหรับ search indexes
   -- prisma/migrations/add_search_indexes.sql
   
   -- Full-text search index สำหรับ posts
   CREATE INDEX posts_search_idx ON posts USING gin(to_tsvector('english', title || ' ' || content));
   
   -- Search index สำหรับ users
   CREATE INDEX users_search_idx ON users USING gin(to_tsvector('english', name || ' ' || COALESCE(bio, '')));
   
   -- Search index สำหรับ comments
   CREATE INDEX comments_search_idx ON comments USING gin(to_tsvector('english', content));
   ```

2. **เพิ่ม Search Fields ใน Prisma Schema**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model Post {
     // ... existing fields
     searchVector String? // For full-text search
     
     @@index([searchVector])
   }
   
   model User {
     // ... existing fields
     searchVector String? // For full-text search
     
     @@index([searchVector])
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   psql -d community_platform -f prisma/migrations/add_search_indexes.sql
   ```

### Step 2: Search API Endpoints
1. **สร้าง Search API Routes**
   ```bash
   mkdir -p src/app/api/search
   touch src/app/api/search/route.ts
   touch src/app/api/search/posts/route.ts
   touch src/app/api/search/users/route.ts
   touch src/app/api/search/suggestions/route.ts
   ```

2. **Search Service Layer**
   ```bash
   touch src/lib/services/search.ts
   ```

3. **Search Utilities**
   ```bash
   touch src/lib/utils/search.ts
   ```

### Step 3: Frontend Search Components
1. **สร้าง Search Components**
   ```bash
   mkdir -p src/components/search
   touch src/components/search/search-bar.tsx
   touch src/components/search/search-results.tsx
   touch src/components/search/search-filters.tsx
   touch src/components/search/search-suggestions.tsx
   touch src/components/search/advanced-search.tsx
   ```

2. **Search Result Components**
   ```bash
   touch src/components/search/post-result.tsx
   touch src/components/search/user-result.tsx
   touch src/components/search/no-results.tsx
   ```

3. **Search Hooks**
   ```bash
   touch src/hooks/use-search.ts
   touch src/hooks/use-search-history.ts
   ```

### Step 4: Search Store & State Management
1. **Search Store (Zustand)**
   ```bash
   touch src/store/search-store.ts
   ```

2. **Search Context**
   ```bash
   touch src/contexts/search-context.tsx
   ```

### Step 5: Search Pages
1. **สร้าง Search Pages**
   ```bash
   mkdir -p src/app/search
   touch src/app/search/page.tsx
   touch src/app/search/posts/page.tsx
   touch src/app/search/users/page.tsx
   touch src/app/search/layout.tsx
   ```

2. **Global Search Integration**
   ```bash
   # เพิ่ม search bar ใน navbar
   # อัพเดท src/components/layout/navbar.tsx
   ```

### Step 6: Advanced Search Features
1. **Search Filters**
   - Content type (posts, users, comments)
   - Date range
   - MBTI personality types
   - User roles
   - Post categories/tags

2. **Search Sorting**
   - Relevance (default)
   - Date (newest/oldest)
   - Popularity (likes, comments)
   - User activity

3. **Search Suggestions**
   - Auto-complete
   - Recent searches
   - Popular searches
   - Related searches

## ✅ Checklist

### Database Optimization
- [ ] เพิ่ม full-text search indexes แล้ว
- [ ] อัพเดท Prisma schema สำหรับ search แล้ว
- [ ] รัน migration สำเร็จ
- [ ] ทดสอบ database search performance

### API Endpoints
- [ ] สร้าง main search API แล้ว
- [ ] สร้าง posts search API แล้ว
- [ ] สร้าง users search API แล้ว
- [ ] สร้าง suggestions API แล้ว
- [ ] สร้าง search service layer แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Frontend Components
- [ ] สร้าง SearchBar component แล้ว
- [ ] สร้าง SearchResults component แล้ว
- [ ] สร้าง SearchFilters component แล้ว
- [ ] สร้าง SearchSuggestions component แล้ว
- [ ] สร้าง AdvancedSearch component แล้ว
- [ ] สร้าง result components แล้ว

### Hooks & Store
- [ ] สร้าง useSearch hook แล้ว
- [ ] สร้าง useSearchHistory hook แล้ว
- [ ] สร้าง search store แล้ว
- [ ] ทดสอบ state management สำเร็จ

### Pages & Navigation
- [ ] สร้าง search pages แล้ว
- [ ] เพิ่ม global search bar แล้ว
- [ ] ตั้งค่า search routing แล้ว
- [ ] ทดสอบ navigation สำเร็จ

### Advanced Features
- [ ] Search filters ทำงาน
- [ ] Search sorting ทำงาน
- [ ] Auto-complete suggestions ทำงาน
- [ ] Search history ทำงาน
- [ ] Pagination ทำงาน

## 🚨 Common Issues

### Database Performance Issues
```bash
# Error: Slow search queries
# Solution: ตรวจสอบ indexes และ optimize queries
EXPLAIN ANALYZE SELECT * FROM posts WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('search term');
```

### Full-text Search Issues
```bash
# Error: Full-text search not working
# Solution: ตรวจสอบ PostgreSQL text search configuration
SELECT * FROM pg_ts_config;
```

### API Performance Issues
```bash
# Error: Search API timeout
# Solution: Implement pagination และ limit results
```

### Frontend Performance Issues
```bash
# Error: Search UI lag
# Solution: Implement debouncing และ virtual scrolling
```

## 🔧 Commands

```bash
# Quick search setup
npm run task:search-setup

# Manual setup steps
psql -d community_platform -f prisma/migrations/add_search_indexes.sql
npx prisma generate
npm run dev

# Test search functionality
npm run test:search

# Analyze search performance
npm run analyze:search-performance
```

## 🔍 Search Features

### Basic Search
- **Global Search**: Search across all content types
- **Quick Search**: Instant search with suggestions
- **Recent Searches**: Show user's recent search history
- **Popular Searches**: Show trending search terms

### Advanced Search
- **Content Type Filters**: Posts, Users, Comments
- **Date Range Filters**: Last day, week, month, year
- **MBTI Filters**: Search by personality types
- **Role Filters**: Users by role (admin, moderator, user)
- **Engagement Filters**: High engagement posts

### Search Results
- **Relevance Scoring**: Most relevant results first
- **Highlighting**: Highlight search terms in results
- **Pagination**: Load results in pages
- **Infinite Scroll**: Load more results on scroll
- **Result Count**: Show total number of results

## 📊 Search Analytics

### Metrics to Track
- **Search Volume**: Number of searches per day
- **Popular Terms**: Most searched keywords
- **Zero Results**: Searches with no results
- **Click-through Rate**: Results clicked vs shown
- **Search Performance**: Query execution time

### Search Optimization
- **Query Optimization**: Optimize database queries
- **Index Maintenance**: Regular index updates
- **Caching**: Cache popular search results
- **Debouncing**: Reduce API calls from typing

## 🔍 Testing Search System

### Manual Testing
1. **Basic Search**
   - ค้นหาโพสต์ด้วย keywords
   - ค้นหาผู้ใช้ด้วยชื่อ
   - ทดสอบ auto-complete

2. **Advanced Search**
   - ใช้ filters ต่างๆ
   - ทดสอบ sorting options
   - ทดสอบ date range filters

3. **Performance Testing**
   - ค้นหาด้วย keywords ยาว
   - ทดสอบกับข้อมูลจำนวนมาก
   - ทดสอบ concurrent searches

### Automated Testing
```bash
# Unit tests
npm run test:search-components

# API tests
npm run test:search-api

# Performance tests
npm run test:search-performance
```

## 📈 Search Performance Optimization

### Database Optimization
```sql
-- Optimize search queries
CREATE INDEX CONCURRENTLY posts_gin_idx ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- Partial indexes for active content
CREATE INDEX posts_active_search_idx ON posts USING gin(to_tsvector('english', title || ' ' || content)) WHERE deleted_at IS NULL;
```

### Frontend Optimization
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);

// Virtual scrolling for large result sets
const VirtualizedResults = ({ results }) => {
  // Implementation with react-window
};
```

## 📚 References

- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Prisma Full-Text Search](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search)
- [React Search Best Practices](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
- [Search UX Guidelines](https://www.nngroup.com/articles/search-interface/)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 07: Email Notification System](./07-email-notifications.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)