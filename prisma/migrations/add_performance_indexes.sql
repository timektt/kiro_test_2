-- Performance optimization indexes for the community platform
-- Run this migration to improve query performance

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON "User"(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON "User"("isActive") WHERE "isActive" = true;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "User"("createdAt");
CREATE INDEX IF NOT EXISTS idx_users_role ON "User"(role);

-- Post table indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS idx_posts_public ON "Post"("isPublic") WHERE "isPublic" = true;
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON "Post"("createdAt");
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON "Post"("authorId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_posts_public_created ON "Post"("isPublic", "createdAt") WHERE "isPublic" = true;

-- Comment table indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON "Comment"("authorId");
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON "Comment"("createdAt");
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON "Comment"("postId", "createdAt");

-- Like table indexes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON "Like"("postId");
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON "Like"("userId");
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON "Like"("createdAt");

-- Follow table indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON "Follow"("followerId");
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON "Follow"("followingId");
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON "Follow"("createdAt");

-- Notification table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON "Notification"("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON "Notification"("createdAt");
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON "Notification"("userId", "createdAt");

-- MBTI table indexes
CREATE INDEX IF NOT EXISTS idx_mbti_user_id ON "MBTI"("userId");
CREATE INDEX IF NOT EXISTS idx_mbti_type ON "MBTI"(type);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_posts_feed_query ON "Post"("authorId", "isPublic", "createdAt") WHERE "isPublic" = true;
CREATE INDEX IF NOT EXISTS idx_user_stats ON "User"("isActive", "createdAt") WHERE "isActive" = true;

-- Full-text search indexes (PostgreSQL specific)
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON "Post" USING gin(to_tsvector('english', content)) WHERE "isPublic" = true;
CREATE INDEX IF NOT EXISTS idx_users_search ON "User" USING gin(to_tsvector('english', coalesce(name, '') || ' ' || username || ' ' || coalesce(bio, ''))) WHERE "isActive" = true;

-- Partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_posts_recent_public ON "Post"("createdAt") WHERE "isPublic" = true AND "createdAt" > (NOW() - INTERVAL '7 days');
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON "Notification"("userId", "createdAt") WHERE "isRead" = false;

-- Covering indexes to avoid table lookups
CREATE INDEX IF NOT EXISTS idx_posts_with_counts ON "Post"("authorId", "createdAt") INCLUDE ("id", "content", "imageUrl", "isPublic");
CREATE INDEX IF NOT EXISTS idx_users_with_profile ON "User"("username") INCLUDE ("id", "name", "image", "bio", "isActive");

-- Performance statistics update
ANALYZE "User";
ANALYZE "Post";
ANALYZE "Comment";
ANALYZE "Like";
ANALYZE "Follow";
ANALYZE "Notification";
ANALYZE "MBTI";