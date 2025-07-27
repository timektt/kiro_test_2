import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * File upload security configuration
 */
export interface FileUploadConfig {
  maxFileSize: number // in bytes
  allowedMimeTypes: string[]
  allowedExtensions: string[]
  maxFiles: number
  scanForMalware?: boolean
  requireAuthentication?: boolean
}

/**
 * Default configurations for different file types
 */
export const fileUploadConfigs = {
  images: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    maxFiles: 1,
    requireAuthentication: true,
  },
  
  avatars: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxFiles: 1,
    requireAuthentication: true,
  },
  
  documents: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
    maxFiles: 5,
    requireAuthentication: true,
  },
}

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedFileName?: string
  fileHash?: string
}

/**
 * File upload security validator
 */
export class FileUploadValidator {
  private config: FileUploadConfig

  constructor(config: FileUploadConfig) {
    this.config = config
  }

  /**
   * Validate uploaded file
   */
  async validateFile(file: File): Promise<FileValidationResult> {
    const errors: string[] = []

    // Check file size
    if (file.size > this.config.maxFileSize) {
      errors.push(`File size exceeds limit of ${this.formatFileSize(this.config.maxFileSize)}`)
    }

    // Check MIME type
    if (!this.config.allowedMimeTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`)
    }

    // Check file extension
    const extension = this.getFileExtension(file.name)
    if (!this.config.allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`)
    }

    // Validate file name
    const sanitizedFileName = this.sanitizeFileName(file.name)
    if (!sanitizedFileName) {
      errors.push('Invalid file name')
    }

    // Check for suspicious file patterns
    if (this.hasSuspiciousPatterns(file.name)) {
      errors.push('File name contains suspicious patterns')
    }

    // Validate file content (basic checks)
    const contentValidation = await this.validateFileContent(file)
    if (!contentValidation.isValid) {
      errors.push(...contentValidation.errors)
    }

    // Generate file hash for duplicate detection
    const fileHash = await this.generateFileHash(file)

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedFileName,
      fileHash,
    }
  }

  /**
   * Validate multiple files
   */
  async validateFiles(files: File[]): Promise<FileValidationResult> {
    const errors: string[] = []

    // Check number of files
    if (files.length > this.config.maxFiles) {
      errors.push(`Too many files. Maximum allowed: ${this.config.maxFiles}`)
    }

    // Validate each file
    for (const file of files) {
      const result = await this.validateFile(file)
      if (!result.isValid) {
        errors.push(`${file.name}: ${result.errors.join(', ')}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate file content based on MIME type
   */
  private async validateFileContent(file: File): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    try {
      // Read first few bytes to check file signature
      const buffer = await this.readFileBytes(file, 0, 512)
      const signature = this.getFileSignature(buffer)

      // Validate file signature matches MIME type
      if (!this.isValidFileSignature(signature, file.type)) {
        errors.push('File content does not match declared type')
      }

      // Additional validation for images
      if (file.type.startsWith('image/')) {
        const imageValidation = await this.validateImageFile(file)
        if (!imageValidation.isValid) {
          errors.push(...imageValidation.errors)
        }
      }

      // Check for embedded scripts or malicious content
      if (this.containsMaliciousContent(buffer)) {
        errors.push('File contains potentially malicious content')
      }

    } catch (error) {
      errors.push('Failed to validate file content')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate image file specifically
   */
  private async validateImageFile(file: File): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    return new Promise((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        // Check dimensions
        if (img.width > 4000 || img.height > 4000) {
          errors.push('Image dimensions too large (max 4000x4000)')
        }
        
        if (img.width < 10 || img.height < 10) {
          errors.push('Image dimensions too small (min 10x10)')
        }

        // Check aspect ratio (prevent extremely wide/tall images)
        const aspectRatio = img.width / img.height
        if (aspectRatio > 10 || aspectRatio < 0.1) {
          errors.push('Invalid image aspect ratio')
        }

        resolve({ isValid: errors.length === 0, errors })
      }
      
      img.onerror = () => {
        errors.push('Invalid or corrupted image file')
        resolve({ isValid: false, errors })
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Read specific bytes from file
   */
  private async readFileBytes(file: File, start: number, length: number): Promise<ArrayBuffer> {
    const slice = file.slice(start, start + length)
    return await slice.arrayBuffer()
  }

  /**
   * Get file signature (magic bytes)
   */
  private getFileSignature(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    return Array.from(bytes.slice(0, 8))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Validate file signature against MIME type
   */
  private isValidFileSignature(signature: string, mimeType: string): boolean {
    const signatures: Record<string, string[]> = {
      'image/jpeg': ['ffd8ff'],
      'image/png': ['89504e47'],
      'image/gif': ['474946383761', '474946383961'],
      'image/webp': ['52494646'],
      'application/pdf': ['255044462d'],
      'application/zip': ['504b0304', '504b0506', '504b0708'],
    }

    const validSignatures = signatures[mimeType]
    if (!validSignatures) {
      return true // Allow unknown types to pass
    }

    return validSignatures.some(validSig => signature.startsWith(validSig))
  }

  /**
   * Check for malicious content patterns
   */
  private containsMaliciousContent(buffer: ArrayBuffer): boolean {
    const text = new TextDecoder().decode(buffer)
    
    // Check for script tags, PHP code, etc.
    const maliciousPatterns = [
      /<script/i,
      /<\?php/i,
      /<%/,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /eval\(/i,
    ]

    return maliciousPatterns.some(pattern => pattern.test(text))
  }

  /**
   * Check for suspicious file name patterns
   */
  private hasSuspiciousPatterns(fileName: string): boolean {
    const suspiciousPatterns = [
      /\.(php|asp|jsp|exe|bat|cmd|scr|vbs|js)$/i,
      /\.(htaccess|htpasswd)$/i,
      /\.\./,
      /[<>:"|?*]/,
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
    ]

    return suspiciousPatterns.some(pattern => pattern.test(fileName))
  }

  /**
   * Sanitize file name
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .substring(0, 255)
  }

  /**
   * Get file extension
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.')
    return lastDot === -1 ? '' : fileName.substring(lastDot).toLowerCase()
  }

  /**
   * Generate file hash for duplicate detection
   */
  private async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}

/**
 * File upload middleware
 */
export function withFileUploadSecurity(config: FileUploadConfig) {
  return function (
    handler: (
      request: NextRequest,
      context: { files: File[]; validationResults: FileValidationResult[] }
    ) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: any[]) => {
      try {
        // Check if request contains files
        const contentType = request.headers.get('content-type')
        if (!contentType?.includes('multipart/form-data')) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_CONTENT_TYPE',
                message: 'Expected multipart/form-data for file upload',
              },
            },
            { status: 400 }
          )
        }

        // Parse form data
        const formData = await request.formData()
        const files: File[] = []
        
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            files.push(value)
          }
        }

        if (files.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'NO_FILES',
                message: 'No files found in request',
              },
            },
            { status: 400 }
          )
        }

        // Validate files
        const validator = new FileUploadValidator(config)
        const validationResults: FileValidationResult[] = []

        for (const file of files) {
          const result = await validator.validateFile(file)
          validationResults.push(result)
          
          if (!result.isValid) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'FILE_VALIDATION_FAILED',
                  message: 'File validation failed',
                  details: result.errors,
                },
              },
              { status: 400 }
            )
          }
        }

        // Execute handler with validated files
        return await handler(request, { files, validationResults })

      } catch (error) {
        console.error('File upload security error:', error)
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_UPLOAD_ERROR',
              message: 'File upload processing failed',
            },
          },
          { status: 500 }
        )
      }
    }
  }
}

