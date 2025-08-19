// Client-side logger (browser)
const clientLogger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta || '')
  },
  error: (message: string, error?: Error | any) => {
    console.error(`[ERROR] ${message}`, error || '')
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta || '')
  },
  debug: (message: string, meta?: any) => {
    console.debug(`[DEBUG] ${message}`, meta || '')
  }
}

// Server-side logger (Node.js)
let serverLogger: any = null

if (typeof window === 'undefined') {
  try {
    const winston = require('winston')
    const DailyRotateFile = require('winston-daily-rotate-file')
    
    const logLevel = process.env.LOG_LEVEL || 'info'
    const logPath = process.env.LOG_FILE_PATH || './logs'
    
    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
    
    // Create transports
    const transports: any[] = [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
    
    // Add file transports only in production or when LOG_FILE_PATH is set
    if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE_PATH) {
      // Error log file
      transports.push(
        new DailyRotateFile({
          filename: `${logPath}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat
        })
      )
      
      // Combined log file
      transports.push(
        new DailyRotateFile({
          filename: `${logPath}/combined-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat
        })
      )
    }
    
    serverLogger = winston.createLogger({
      level: logLevel,
      format: logFormat,
      transports,
      exitOnError: false
    })
  } catch (error) {
    console.error('Failed to initialize server logger:', error)
    serverLogger = clientLogger
  }
}

// Use appropriate logger based on environment
const logger = typeof window === 'undefined' ? (serverLogger || clientLogger) : clientLogger

export default logger
export { logger }

// Helper functions for easier logging
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logError = (message: string, error?: Error | any) => {
  logger.error(message, error)
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta)
}