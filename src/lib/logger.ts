import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logLevel = process.env.LOG_LEVEL || 'info'
const logPath = process.env.LOG_FILE_PATH || './logs'

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create transports
const transports: winston.transport[] = [
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

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false
})

// Handle uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: `${logPath}/exceptions-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    })
  )

  logger.rejections.handle(
    new DailyRotateFile({
      filename: `${logPath}/rejections-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    })
  )
}

export default logger

// Helper functions for different log levels
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logError = (message: string, error?: Error | any) => {
  logger.error(message, { error: error?.stack || error })
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta)
}