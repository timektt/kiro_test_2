import { z } from "zod"

// User validation schemas
export const userSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  socialLinks: z.object({
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
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
  content: z.string().min(1, "Post content is required").max(2000, "Post must be less than 2000 characters"),
  imageUrl: z.string().url("Invalid image URL").optional(),
})

// Comment validation schemas
export const commentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
  postId: z.string().cuid("Invalid post ID"),
})

// Authentication validation schemas
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

// Types
export type UserInput = z.infer<typeof userSchema>
export type MBTIInput = z.infer<typeof mbtiSchema>
export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiSuccess<T> = {
  success: true
  data: T
}