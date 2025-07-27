import { z } from "zod"

// Security-enhanced validation helpers
const sanitizeString = (str: string) => str.trim().replace(/\s+/g, ' ')
const noHtmlTags = (str: string) => !/<[^>]*>/g.test(str)
const noScriptTags = (str: string) => !/<script|javascript:|vbscript:|onload=|onerror=/gi.test(str)

// User validation schemas
export const userSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform(sanitizeString)
    .refine(noHtmlTags, "Username cannot contain HTML tags")
    .refine(noScriptTags, "Username cannot contain script content"),
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .transform(sanitizeString)
    .refine(noHtmlTags, "Name cannot contain HTML tags")
    .refine(noScriptTags, "Name cannot contain script content"),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .transform(sanitizeString)
    .refine(noHtmlTags, "Bio cannot contain HTML tags")
    .refine(noScriptTags, "Bio cannot contain script content")
    .optional(),
  socialLinks: z.object({
    twitter: z.string()
      .url("Invalid Twitter URL")
      .refine(url => url.includes('twitter.com') || url.includes('x.com'), "Must be a Twitter/X URL")
      .optional().or(z.literal("")),
    github: z.string()
      .url("Invalid GitHub URL")
      .refine(url => url.includes('github.com'), "Must be a GitHub URL")
      .optional().or(z.literal("")),
    linkedin: z.string()
      .url("Invalid LinkedIn URL")
      .refine(url => url.includes('linkedin.com'), "Must be a LinkedIn URL")
      .optional().or(z.literal("")),
  }).optional(),
})

export const mbtiSchema = z.object({
  type: z.enum([
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP", 
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ]),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
})

// Post validation schemas
export const postSchema = z.object({
  content: z.string()
    .min(1, "Post content is required")
    .max(2000, "Post must be less than 2000 characters")
    .transform(sanitizeString)
    .refine(noScriptTags, "Post content cannot contain script content")
    .refine(content => content.split('\n').length <= 50, "Post cannot have more than 50 lines")
    .refine(content => !/(https?:\/\/[^\s]+){10,}/g.test(content), "Post cannot contain excessive links"),
  imageUrl: z.string()
    .url("Invalid image URL")
    .refine(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url), "Image URL must end with valid image extension")
    .optional(),
  isPublic: z.boolean().default(true),
})

// Comment validation schemas
export const commentSchema = z.object({
  content: z.string()
    .min(1, "Comment is required")
    .max(1000, "Comment must be less than 1000 characters")
    .transform(sanitizeString)
    .refine(noScriptTags, "Comment cannot contain script content")
    .refine(content => content.split('\n').length <= 20, "Comment cannot have more than 20 lines"),
  postId: z.string().cuid("Invalid post ID"),
})

// Authentication validation schemas
export const signUpSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .transform(sanitizeString)
    .refine(noHtmlTags, "Name cannot contain HTML tags")
    .refine(noScriptTags, "Name cannot contain script content"),
  email: z.string()
    .email("Invalid email address")
    .max(254, "Email address too long")
    .toLowerCase()
    .refine(email => !email.includes('+'), "Email aliases not allowed")
    .refine(email => !/[<>"'&]/g.test(email), "Email contains invalid characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .refine(pwd => /[A-Z]/.test(pwd), "Password must contain at least one uppercase letter")
    .refine(pwd => /[a-z]/.test(pwd), "Password must contain at least one lowercase letter")
    .refine(pwd => /[0-9]/.test(pwd), "Password must contain at least one number")
    .refine(pwd => /[^A-Za-z0-9]/.test(pwd), "Password must contain at least one special character"),
})

export const signInSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .max(254, "Email address too long")
    .toLowerCase(),
  password: z.string()
    .min(1, "Password is required")
    .max(128, "Password too long"),
})

// Search validation schemas
export const searchSchema = z.object({
  q: z.string()
    .min(1, "Search query is required")
    .max(100, "Search query too long")
    .transform(sanitizeString)
    .refine(noScriptTags, "Search query cannot contain script content"),
  type: z.enum(['users', 'posts', 'all']).default('all'),
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 1000, "Invalid page number").default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 100, "Invalid limit").default('20'),
  mbti: z.enum([
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP", 
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ]).optional(),
})

// File upload validation schemas
export const fileUploadSchema = z.object({
  fileName: z.string()
    .min(1, "File name is required")
    .max(255, "File name too long")
    .refine(name => !/[<>:"|?*\\\/]/.test(name), "File name contains invalid characters")
    .refine(name => !name.startsWith('.'), "File name cannot start with a dot")
    .refine(name => !/\.(php|asp|jsp|exe|bat|cmd|scr|vbs|js)$/i.test(name), "File type not allowed"),
  fileSize: z.number()
    .min(1, "File cannot be empty")
    .max(10 * 1024 * 1024, "File size cannot exceed 10MB"),
  mimeType: z.string()
    .refine(type => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type), "File type not allowed"),
})

// Admin validation schemas
export const adminActionSchema = z.object({
  action: z.enum(['hide', 'show', 'delete', 'ban', 'unban']),
  reason: z.string()
    .max(500, "Reason too long")
    .transform(sanitizeString)
    .refine(noScriptTags, "Reason cannot contain script content")
    .optional(),
  targetId: z.string().cuid("Invalid target ID"),
  targetType: z.enum(['user', 'post', 'comment']),
})

// Pagination validation schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 1000, "Invalid page number").default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 100, "Invalid limit").default('20'),
  sort: z.enum(['recent', 'popular', 'trending']).default('recent'),
})

// API response schemas
export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
})

export const apiSuccessSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  })

// Rate limiting schemas
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000).max(24 * 60 * 60 * 1000), // 1 second to 24 hours
  maxRequests: z.number().min(1).max(10000),
  message: z.string().max(200).optional(),
})

// Types
export type UserInput = z.infer<typeof userSchema>
export type MBTIInput = z.infer<typeof mbtiSchema>
export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type AdminActionInput = z.infer<typeof adminActionSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiSuccess<T> = {
  success: true
  data: T
}
export type RateLimitConfig = z.infer<typeof rateLimitSchema>

