# Database Schema Documentation

## Overview

The community platform uses PostgreSQL with Prisma ORM. The schema is designed for scalability, performance, and data integrity with proper indexing and relationships.

## Core Models

### User
The central entity representing platform users.

```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  bio           String?   @db.Text
  socialLinks   Json?     @default("{}")
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Key Features:**
- Unique username and email constraints
- Flexible social links storage (JSON)
- Role-based access control
- Soft delete via `isActive` flag
- Comprehensive indexing for performance

### MBTI (Myers-Briggs Type Indicator)
One-to-one relationship with User for personality type assignment.

```prisma
model MBTI {
  id          String   @id @default(cuid())
  type        MBTIType
  description String?
  userId      String   @unique
  assignedAt  DateTime @default(now())
  isLocked    Boolean  @default(true)
}
```

**16 MBTI Types Supported:**
- **Analysts**: INTJ, INTP, ENTJ, ENTP
- **Diplomats**: INFJ, INFP, ENFJ, ENFP
- **Sentinels**: ISTJ, ISFJ, ESTJ, ESFJ
- **Explorers**: ISTP, ISFP, ESTP, ESFP

### Post
User-generated content with engagement tracking.

```prisma
model Post {
  id        String   @id @default(cuid())
  content   String   @db.Text
  imageUrl  String?
  authorId  String
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Features:**
- Rich text content support
- Optional image attachments
- Public/private visibility control
- Optimized for chronological feeds

### Comment
Threaded discussions on posts.

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  postId    String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Like
User engagement tracking with posts.

```prisma
model Like {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())
}
```

**Constraints:**
- Unique constraint on `[postId, userId]` prevents duplicate likes
- Indexed for fast engagement queries

### Follow
Bidirectional user relationships.

```prisma
model Follow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
}
```

**Features:**
- Self-referential User relationships
- Unique constraint prevents duplicate follows
- Supports follower/following counts

### Notification
Real-time user notifications system.

```prisma
model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  message   String
  read      Boolean          @default(false)
  userId    String
  relatedId String?
  createdAt DateTime         @default(now())
}
```

**Notification Types:**
- `LIKE`: Post liked
- `COMMENT`: Post commented on
- `FOLLOW`: New follower
- `MENTION`: User mentioned
- `SYSTEM`: Platform announcements

### Ranking
Gamification and leaderboard system.

```prisma
model Ranking {
  id          String      @id @default(cuid())
  userId      String
  type        RankingType
  score       Int         @default(0)
  rank        Int?
  period      String      // e.g., "2024-01", "2024-Q1", "all-time"
  calculatedAt DateTime   @default(now())
  updatedAt   DateTime    @updatedAt
}
```

**Ranking Types:**
- `POSTS_LIKES`: Total likes received
- `POSTS_COUNT`: Number of posts created
- `COMMENTS_COUNT`: Number of comments made
- `FOLLOWERS_COUNT`: Number of followers
- `ENGAGEMENT`: Combined engagement score
- `WEEKLY_ACTIVE`: Weekly activity score
- `MONTHLY_ACTIVE`: Monthly activity score

## NextAuth.js Integration

### Account
OAuth provider account linking.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
}
```

### Session
User session management.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
}
```

### VerificationToken
Email verification and password reset tokens.

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}
```

## Enums

### Role
```prisma
enum Role {
  USER      // Regular platform user
  ADMIN     // Full platform access
  MODERATOR // Content moderation access
}
```

### NotificationType
```prisma
enum NotificationType {
  LIKE    // Post engagement
  COMMENT // Post discussion
  FOLLOW  // Social connection
  MENTION // User reference
  SYSTEM  // Platform announcements
}
```

### MBTIType
All 16 Myers-Briggs personality types supported.

### RankingType
Various metrics for user ranking and gamification.

## Performance Optimizations

### Indexes
Strategic indexing for common query patterns:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Post feed queries
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_is_public ON posts(is_public);
CREATE INDEX idx_posts_author_created ON posts(author_id, created_at);

-- Comment queries
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);

-- Engagement queries
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at);

-- Social features
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at);

-- Rankings
CREATE INDEX idx_rankings_type_period_score ON rankings(type, period, score);
CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_rank ON rankings(rank);
```

### Query Optimization
- Composite indexes for common filter combinations
- Proper use of `include` vs `select` in Prisma queries
- Pagination with cursor-based approach for large datasets
- Aggregation queries for counts and statistics

## Data Integrity

### Constraints
- Unique constraints on critical fields (email, username, session tokens)
- Foreign key constraints with proper cascade behavior
- Check constraints for data validation

### Cascade Behavior
- User deletion cascades to all related content
- Post deletion cascades to comments and likes
- Account deletion maintains user data integrity

## Migration Strategy

### Development
```bash
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:seed      # Populate with sample data
```

### Production
```bash
npm run db:setup     # Automated migration and seeding
```

### Backup Strategy
- Regular automated backups of PostgreSQL database
- Point-in-time recovery capability
- Schema versioning through Prisma migrations

## Security Considerations

### Data Protection
- Sensitive fields (passwords) handled by NextAuth.js
- User data access controlled by authentication middleware
- Admin-only access to user management functions

### Privacy
- User data anonymization options
- GDPR compliance considerations
- Audit trail for data modifications

## Monitoring and Analytics

### Performance Metrics
- Query execution time monitoring
- Index usage statistics
- Connection pool monitoring

### Business Metrics
- User engagement tracking
- Content creation patterns
- Platform growth metrics

This schema provides a solid foundation for a scalable community platform with room for future enhancements and optimizations.