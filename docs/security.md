# Security Implementation

This document describes the comprehensive security measures implemented in the community platform.

## Overview

The security implementation includes:
- **Input validation** using Zod schemas with sanitization
- **Rate limiting** to prevent abuse and DoS attacks
- **CSRF protection** for state-changing operations
- **File upload security** with content validation
- **Security headers** for XSS and clickjacking protection
- **Request validation** and origin checking

## Security Middleware

### 1. Input Validation (`src/lib/middleware/validation.ts`)

Validates and sanitizes all user input using Zod schemas:

```typescript
import { withValidation } from '@/lib/middleware/validation'
import { postSchema } from '@/lib/validations'

export const POST = withValidation({
  body: postSchema,
  query: searchSchema,
  params: z.object({ id: z.string().cuid() })
})(async (request, context) => {
  // context.body, context.query, context.params are validated and sanitized
})
```

**Features:**
- Automatic input sanitization
- HTML/script tag removal
- Length limits and format validation
- Type coercion and transformation
- Detailed error messages

### 2. Rate Limiting (`src/lib/middleware/rate-limit.ts`)

Prevents abuse with configurable rate limits:

```typescript
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'

export const POST = withRateLimit(rateLimitConfigs.posts)(
  async (request) => {
    // Handler with rate limiting applied
  }
)
```

**Configurations:**
- **Auth endpoints**: 5 requests per 15 minutes
- **Post creation**: 10 requests per minute
- **Comments**: 20 requests per minute
- **Interactions**: 100 requests per minute
- **File uploads**: 5 requests per minute
- **Search**: 30 requests per minute

**Features:**
- In-memory storage (Redis support available)
- Adaptive rate limiting for suspicious users
- Rate limit headers in responses
- Automatic cleanup of expired entries

### 3. CSRF Protection (`src/lib/middleware/security.ts`)

Protects against Cross-Site Request Forgery:

```typescript
import { withCSRFProtection } from '@/lib/middleware/security'

export const POST = withCSRFProtection()(
  async (request) => {
    // CSRF token validated automatically
  }
)
```

**Features:**
- Token generation and validation
- Timing-safe comparison
- Automatic token rotation
- Cookie-based token storage

### 4. File Upload Security (`src/lib/middleware/file-upload.ts`)

Comprehensive file upload validation:

```typescript
import { withFileUploadSecurity, fileUploadConfigs } from '@/lib/middleware/file-upload'

export const POST = withFileUploadSecurity(fileUploadConfigs.images)(
  async (request, context) => {
    // context.files contains validated files
    // context.validationResults contains validation details
  }
)
```

**Validations:**
- File size limits
- MIME type validation
- File extension checking
- Magic byte verification
- Image dimension validation
- Malicious content detection
- File name sanitization

### 5. Security Headers

Automatic security headers for all responses:

```typescript
// Applied automatically by withSecurity middleware
const securityHeaders = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': '...',
  'Permissions-Policy': '...',
}
```

## Pre-configured Security Wrappers

### Authentication Endpoints
```typescript
import { securityWrappers } from '@/lib/security'

export const POST = securityWrappers.auth(async (request, context) => {
  // Rate limited, validated, no CSRF required
})
```

### Post Management
```typescript
export const POST = securityWrappers.posts(async (request, context) => {
  // Rate limited, CSRF protected, content validated
})
```

### File Uploads
```typescript
export const POST = securityWrappers.uploads(async (request, context) => {
  // File validation, rate limited, auth required
})
```

### Search Endpoints
```typescript
export const GET = securityWrappers.search(async (request, context) => {
  // Query validation, rate limited
})
```

## Input Validation Schemas

### Enhanced User Validation
```typescript
export const userSchema = z.object({
  username: z.string()
    .min(3).max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .transform(sanitizeString)
    .refine(noHtmlTags)
    .refine(noScriptTags),
  // ... other fields
})
```

### Secure Post Validation
```typescript
export const postSchema = z.object({
  content: z.string()
    .min(1).max(2000)
    .transform(sanitizeString)
    .refine(noScriptTags)
    .refine(content => content.split('\n').length <= 50)
    .refine(content => !/(https?:\/\/[^\s]+){10,}/g.test(content)),
  // ... other fields
})
```

### Strong Password Requirements
```typescript
export const signUpSchema = z.object({
  password: z.string()
    .min(8).max(128)
    .refine(pwd => /[A-Z]/.test(pwd), "Must contain uppercase")
    .refine(pwd => /[a-z]/.test(pwd), "Must contain lowercase")
    .refine(pwd => /[0-9]/.test(pwd), "Must contain number")
    .refine(pwd => /[^A-Za-z0-9]/.test(pwd), "Must contain special char"),
  // ... other fields
})
```

## Security Utilities

### Input Sanitization
```typescript
import { InputSanitizer } from '@/lib/middleware/security'

const cleanHtml = InputSanitizer.sanitizeHtml(userInput)
const cleanSql = InputSanitizer.sanitizeSql(userInput)
const cleanGeneral = InputSanitizer.sanitizeGeneral(userInput)
const cleanFileName = InputSanitizer.sanitizeFileName(fileName)
```

### Request Validation
```typescript
import { RequestValidator } from '@/lib/middleware/security'

const validOrigin = RequestValidator.validateOrigin(request)
const validSize = RequestValidator.validateRequestSize(request, maxSize)
const validContentType = RequestValidator.validateContentType(request, allowedTypes)
```

### Security Auditing
```typescript
import { SecurityAudit } from '@/lib/security'

// Log security events
SecurityAudit.logSecurityEvent({
  type: 'RATE_LIMIT_EXCEEDED',
  clientId: 'user:123',
  details: { endpoint: '/api/posts' }
})

// Detect suspicious activity
const suspicious = SecurityAudit.detectSuspiciousActivity(request)

// Generate security report
const report = await SecurityAudit.generateSecurityReport()
```

## File Upload Security

### Image Upload Example
```typescript
import { FileUploadValidator, fileUploadConfigs } from '@/lib/middleware/file-upload'

const validator = new FileUploadValidator(fileUploadConfigs.images)
const result = await validator.validateFile(file)

if (!result.isValid) {
  throw new Error(result.errors.join(', '))
}
```

### Validation Features
- **File size limits**: Configurable per file type
- **MIME type checking**: Whitelist approach
- **Magic byte validation**: Verify actual file content
- **Image dimension limits**: Prevent oversized images
- **Malicious content detection**: Scan for embedded scripts
- **File name sanitization**: Remove dangerous characters
- **Duplicate detection**: Hash-based file identification

## Rate Limiting

### Basic Usage
```typescript
import { rateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'

const handler = rateLimit(rateLimitConfigs.general)(async (request) => {
  // Your handler code
})
```

### Adaptive Rate Limiting
```typescript
import { adaptiveRateLimit, markSuspicious } from '@/lib/middleware/rate-limit'

// Apply stricter limits for suspicious users
const handler = adaptiveRateLimit(baseConfig)(async (request) => {
  // Handler code
})

// Mark user as suspicious
markSuspicious('user:123', 60 * 60 * 1000) // 1 hour
```

### Redis Integration (Production)
```typescript
import { RedisRateLimit } from '@/lib/middleware/rate-limit'

const redisRateLimit = new RedisRateLimit(redisClient)
const result = await redisRateLimit.checkLimit(clientId, config)
```

## Security Configuration

### Environment Variables
```env
# Security settings
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_CSRF_ENABLED=true
SECURITY_FILE_UPLOAD_MAX_SIZE=10485760
SECURITY_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# CSRF settings
CSRF_SECRET=your-csrf-secret-key
CSRF_TOKEN_LENGTH=32

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuration Schema
```typescript
import { securityConfigSchema, defaultSecurityConfig } from '@/lib/security'

const config = securityConfigSchema.parse({
  rateLimit: {
    enabled: true,
    windowMs: 60000,
    maxRequests: 100,
  },
  csrf: {
    enabled: true,
    tokenLength: 32,
  },
  // ... other settings
})
```

## Best Practices

### 1. Input Validation
- Always validate and sanitize user input
- Use whitelist approach for allowed values
- Implement length limits for all text fields
- Remove or escape HTML/script content
- Validate file uploads thoroughly

### 2. Rate Limiting
- Apply appropriate limits per endpoint type
- Use stricter limits for sensitive operations
- Implement adaptive limiting for suspicious users
- Monitor rate limit violations

### 3. CSRF Protection
- Enable CSRF protection for state-changing operations
- Use secure, httpOnly cookies for tokens
- Implement proper token rotation
- Validate tokens with timing-safe comparison

### 4. File Uploads
- Validate file types using multiple methods
- Scan for malicious content
- Limit file sizes appropriately
- Store uploads outside web root
- Generate unique file names

### 5. Security Headers
- Implement comprehensive CSP policies
- Use HTTPS in production
- Enable security headers for all responses
- Regular security header audits

### 6. Monitoring and Logging
- Log all security events
- Monitor for suspicious patterns
- Set up alerts for security violations
- Regular security audits and reports

## Testing Security

### Unit Tests
```typescript
import { validateBody } from '@/lib/middleware/validation'
import { postSchema } from '@/lib/validations'

test('validates post content', async () => {
  const request = new Request('/', {
    method: 'POST',
    body: JSON.stringify({ content: 'Valid post content' })
  })
  
  const result = await validateBody(postSchema)(request)
  expect(result.content).toBe('Valid post content')
})
```

### Security Tests
```typescript
test('blocks XSS attempts', async () => {
  const maliciousContent = '<script>alert("xss")</script>'
  
  expect(() => postSchema.parse({ content: maliciousContent }))
    .toThrow('cannot contain script content')
})

test('enforces rate limits', async () => {
  // Test rate limiting behavior
})
```

## Production Considerations

1. **Use Redis for rate limiting** in distributed environments
2. **Enable malware scanning** for file uploads
3. **Implement WAF** (Web Application Firewall)
4. **Regular security audits** and penetration testing
5. **Monitor security logs** and set up alerts
6. **Keep dependencies updated** for security patches
7. **Use HTTPS everywhere** with proper certificates
8. **Implement proper backup** and disaster recovery