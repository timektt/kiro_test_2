# Task 09: Tags and Categories

## 📋 Overview
**Priority:** Low  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic post functionality, search system  

## 🎯 Objective
พัฒนาระบบ tags และ categories สำหรับจัดหมวดหมู่โพสต์ เพื่อให้ผู้ใช้สามารถค้นหาและกรองเนื้อหาได้ง่ายขึ้น

## 📝 Task Details

### Step 1: Database Schema Update
1. **เพิ่ม Tags และ Categories Models**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model Category {
     id          String   @id @default(cuid())
     name        String   @unique
     slug        String   @unique
     description String?
     color       String?  // Hex color for UI
     icon        String?  // Icon name or emoji
     parentId    String?
     isActive    Boolean  @default(true)
     sortOrder   Int      @default(0)
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     // Relations
     parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
     children Category[] @relation("CategoryHierarchy")
     posts    Post[]
     
     @@map("categories")
   }
   
   model Tag {
     id        String   @id @default(cuid())
     name      String   @unique
     slug      String   @unique
     color     String?  // Hex color for UI
     usageCount Int     @default(0)
     isActive  Boolean  @default(true)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     // Relations
     posts PostTag[]
     
     @@map("tags")
   }
   
   model PostTag {
     id     String @id @default(cuid())
     postId String
     tagId  String
     
     // Relations
     post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
     tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
     
     @@unique([postId, tagId])
     @@map("post_tags")
   }
   
   model PostCategory {
     id         String @id @default(cuid())
     postId     String
     categoryId String
     
     // Relations
     post     Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
     category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
     
     @@unique([postId, categoryId])
     @@map("post_categories")
   }
   ```

2. **อัพเดท Post Model**
   ```prisma
   model Post {
     // ... existing fields
     
     // Tags and Categories relations
     tags       PostTag[]
     categories PostCategory[]
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Step 2: Seed Categories and Tags
1. **สร้าง Seed Data**
   ```bash
   touch prisma/seeds/categories.ts
   touch prisma/seeds/tags.ts
   ```

2. **อัพเดท Seed Script**
   ```bash
   # อัพเดท prisma/seed.ts เพื่อรวม categories และ tags
   ```

3. **รัน Seed**
   ```bash
   npm run db:seed
   ```

### Step 3: Tags and Categories API
1. **สร้าง API Routes**
   ```bash
   mkdir -p src/app/api/categories
   touch src/app/api/categories/route.ts
   touch src/app/api/categories/[id]/route.ts
   touch src/app/api/categories/[id]/posts/route.ts
   
   mkdir -p src/app/api/tags
   touch src/app/api/tags/route.ts
   touch src/app/api/tags/[id]/route.ts
   touch src/app/api/tags/search/route.ts
   touch src/app/api/tags/popular/route.ts
   ```

2. **Service Layer**
   ```bash
   touch src/lib/services/categories.ts
   touch src/lib/services/tags.ts
   ```

3. **Utilities**
   ```bash
   touch src/lib/utils/slug.ts
   touch src/lib/utils/tag-parser.ts
   ```

### Step 4: Frontend Components
1. **Tag Components**
   ```bash
   mkdir -p src/components/tags
   touch src/components/tags/tag-input.tsx
   touch src/components/tags/tag-list.tsx
   touch src/components/tags/tag-chip.tsx
   touch src/components/tags/tag-selector.tsx
   touch src/components/tags/popular-tags.tsx
   ```

2. **Category Components**
   ```bash
   mkdir -p src/components/categories
   touch src/components/categories/category-selector.tsx
   touch src/components/categories/category-tree.tsx
   touch src/components/categories/category-card.tsx
   touch src/components/categories/category-breadcrumb.tsx
   ```

3. **Post Integration Components**
   ```bash
   touch src/components/posts/post-tags.tsx
   touch src/components/posts/post-categories.tsx
   touch src/components/posts/post-metadata.tsx
   ```

### Step 5: Admin Management
1. **Admin Components**
   ```bash
   mkdir -p src/components/admin/tags
   touch src/components/admin/tags/tag-management.tsx
   touch src/components/admin/tags/tag-form.tsx
   touch src/components/admin/tags/tag-stats.tsx
   
   mkdir -p src/components/admin/categories
   touch src/components/admin/categories/category-management.tsx
   touch src/components/admin/categories/category-form.tsx
   touch src/components/admin/categories/category-hierarchy.tsx
   ```

2. **Admin Pages**
   ```bash
   mkdir -p src/app/admin/tags
   touch src/app/admin/tags/page.tsx
   touch src/app/admin/tags/new/page.tsx
   touch src/app/admin/tags/[id]/edit/page.tsx
   
   mkdir -p src/app/admin/categories
   touch src/app/admin/categories/page.tsx
   touch src/app/admin/categories/new/page.tsx
   touch src/app/admin/categories/[id]/edit/page.tsx
   ```

### Step 6: Browse and Filter Pages
1. **Browse Pages**
   ```bash
   mkdir -p src/app/browse
   touch src/app/browse/page.tsx
   touch src/app/browse/categories/page.tsx
   touch src/app/browse/categories/[slug]/page.tsx
   touch src/app/browse/tags/page.tsx
   touch src/app/browse/tags/[slug]/page.tsx
   ```

2. **Filter Components**
   ```bash
   touch src/components/filters/tag-filter.tsx
   touch src/components/filters/category-filter.tsx
   touch src/components/filters/combined-filter.tsx
   ```

### Step 7: Integration with Existing Features
1. **Post Creation/Editing**
   ```bash
   # อัพเดท post form เพื่อรวม tags และ categories
   # src/components/posts/post-form.tsx
   ```

2. **Search Integration**
   ```bash
   # อัพเดท search functionality เพื่อรวม tags และ categories
   # src/lib/services/search.ts
   ```

3. **Feed Integration**
   ```bash
   # อัพเดท feed เพื่อแสดง tags และ categories
   # src/components/feed/post-card.tsx
   ```

## ✅ Checklist

### Database Schema
- [ ] เพิ่ม Category model แล้ว
- [ ] เพิ่ม Tag model แล้ว
- [ ] เพิ่ม PostTag และ PostCategory junction tables แล้ว
- [ ] อัพเดท Post model relations แล้ว
- [ ] รัน migration สำเร็จ

### Seed Data
- [ ] สร้าง categories seed data แล้ว
- [ ] สร้าง tags seed data แล้ว
- [ ] อัพเดท seed script แล้ว
- [ ] รัน seed สำเร็จ

### API Endpoints
- [ ] สร้าง categories API แล้ว
- [ ] สร้าง tags API แล้ว
- [ ] สร้าง service layer แล้ว
- [ ] สร้าง utility functions แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Frontend Components
- [ ] สร้าง tag components แล้ว
- [ ] สร้าง category components แล้ว
- [ ] สร้าง post integration components แล้ว
- [ ] ทดสอบ components สำเร็จ

### Admin Management
- [ ] สร้าง admin tag management แล้ว
- [ ] สร้าง admin category management แล้ว
- [ ] สร้าง admin pages แล้ว
- [ ] ทดสอบ admin functionality สำเร็จ

### Browse and Filter
- [ ] สร้าง browse pages แล้ว
- [ ] สร้าง filter components แล้ว
- [ ] ทดสอบ browsing และ filtering สำเร็จ

### Integration
- [ ] อัพเดท post creation/editing แล้ว
- [ ] อัพเดท search functionality แล้ว
- [ ] อัพเดท feed display แล้ว
- [ ] ทดสอบ integration สำเร็จ

## 🚨 Common Issues

### Tag Input Issues
```bash
# Error: Duplicate tags created
# Solution: Implement proper tag deduplication และ case-insensitive matching
```

### Category Hierarchy Issues
```bash
# Error: Circular reference in categories
# Solution: Implement validation เพื่อป้องกัน circular references
```

### Performance Issues
```bash
# Error: Slow tag/category queries
# Solution: Add proper indexes และ implement caching
```

### UI/UX Issues
```bash
# Error: Tag input difficult to use
# Solution: Implement auto-complete และ better UX patterns
```

## 🔧 Commands

```bash
# Quick tags/categories setup
npm run task:tags-categories-setup

# Manual setup steps
npx prisma db push
npx prisma generate
npm run db:seed
npm run dev

# Test tags and categories
npm run test:tags-categories

# Generate tag statistics
npm run stats:tags

# Clean unused tags
npm run clean:unused-tags
```

## 🏷️ Tag and Category Features

### Tag System
- **Auto-complete**: Suggest existing tags while typing
- **Popular Tags**: Show trending and popular tags
- **Tag Cloud**: Visual representation of tag popularity
- **Tag Statistics**: Usage count and trends
- **Tag Colors**: Custom colors for different tag types

### Category System
- **Hierarchical Categories**: Parent-child relationships
- **Category Icons**: Visual icons for categories
- **Category Colors**: Color coding for easy identification
- **Category Descriptions**: Detailed descriptions for categories
- **Category Statistics**: Post count and activity metrics

### Filtering and Browse
- **Multi-tag Filtering**: Filter by multiple tags
- **Category Browsing**: Browse posts by category
- **Combined Filters**: Use tags and categories together
- **Advanced Search**: Search within specific tags/categories
- **Related Content**: Show related posts based on tags/categories

## 📊 Analytics and Statistics

### Tag Analytics
- **Usage Trends**: Track tag usage over time
- **Popular Tags**: Most used tags by period
- **Tag Relationships**: Tags commonly used together
- **User Tag Preferences**: User's favorite tags

### Category Analytics
- **Category Performance**: Post count and engagement by category
- **Category Growth**: New posts per category over time
- **User Preferences**: Most popular categories among users
- **Content Distribution**: How content is distributed across categories

## 🔍 Testing Tags and Categories

### Manual Testing
1. **Tag Creation**
   - สร้างโพสต์พร้อม tags
   - ทดสอบ auto-complete
   - ทดสอบ tag suggestions

2. **Category Assignment**
   - กำหนด categories ให้โพสต์
   - ทดสอบ hierarchical categories
   - ทดสอบ category browsing

3. **Filtering**
   - กรองโพสต์ด้วย tags
   - กรองโพสต์ด้วย categories
   - ทดสอบ combined filtering

### Automated Testing
```bash
# Unit tests
npm run test:tag-components
npm run test:category-components

# API tests
npm run test:tags-api
npm run test:categories-api

# Integration tests
npm run test:tags-categories-integration
```

## 📈 Optimization Strategies

### Database Optimization
```sql
-- Indexes for better performance
CREATE INDEX tags_name_idx ON tags(name);
CREATE INDEX tags_usage_count_idx ON tags(usage_count DESC);
CREATE INDEX categories_slug_idx ON categories(slug);
CREATE INDEX post_tags_post_id_idx ON post_tags(post_id);
CREATE INDEX post_tags_tag_id_idx ON post_tags(tag_id);
```

### Caching Strategy
```typescript
// Cache popular tags and categories
const popularTags = await redis.get('popular_tags') || 
  await fetchPopularTags();

const categoryTree = await redis.get('category_tree') || 
  await buildCategoryTree();
```

### Frontend Optimization
```typescript
// Debounced tag search
const debouncedTagSearch = useMemo(
  () => debounce((query: string) => {
    searchTags(query);
  }, 300),
  []
);

// Virtual scrolling for large tag lists
const VirtualTagList = ({ tags }) => {
  // Implementation with react-window
};
```

## 🎨 UI/UX Best Practices

### Tag Input Design
- **Visual Feedback**: Clear visual indication of selected tags
- **Easy Removal**: Simple way to remove tags
- **Keyboard Navigation**: Support arrow keys and enter
- **Auto-complete**: Smart suggestions based on existing tags

### Category Selection
- **Tree View**: Hierarchical display of categories
- **Search**: Search within categories
- **Icons and Colors**: Visual differentiation
- **Breadcrumbs**: Show category path

### Filtering Interface
- **Clear Filters**: Easy way to clear all filters
- **Filter Count**: Show number of active filters
- **Quick Filters**: Common filter combinations
- **Filter Persistence**: Remember user's filter preferences

## 📚 References

- [Tag System Design Patterns](https://ux.stackexchange.com/questions/tagged/tags)
- [Category Hierarchy Best Practices](https://www.nngroup.com/articles/category-names-suck/)
- [Tagging UX Guidelines](https://www.lukew.com/ff/entry.asp?1562)
- [Content Organization Principles](https://www.usability.gov/how-to-and-tools/methods/card-sorting.html)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 10: Analytics Dashboard](./10-analytics-dashboard.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)