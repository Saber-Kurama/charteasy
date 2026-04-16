/**
 * Logger utility based on VUtils
 * Original: https://github.com/VisActor/VUtil/blob/main/packages/vutils/src/logger.ts
 * Minified as: Cy.V
 */

// Log level enum
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NONE: 'none',
} as const

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel]

// Logger options
interface LoggerOptions {
  level?: LogLevelType
  prefix?: string
  enabled?: boolean
}

// Logger class (original: Cy.V from vutils)
class Logger {
  private static instance: Logger
  private level: LogLevelType = LogLevel.DEBUG
  private prefix: string = '[VChartEditor]'
  private enabled: boolean = true

  private constructor(options?: LoggerOptions) {
    if (options?.level) {
      this.level = options.level
    }
    if (options?.prefix) {
      this.prefix = options.prefix
    }
    if (options?.enabled !== undefined) {
      this.enabled = options.enabled
    }
  }

  // Get singleton instance (original: Cy.V.getInstance())
  static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options)
    }
    return Logger.instance
  }

  // Set log level
  setLevel(level: LogLevelType): void {
    this.level = level
  }

  // Enable/disable logging
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  // Check if should log
  private shouldLog(level: LogLevelType): boolean {
    if (!this.enabled) return false
    
    const levels: LogLevelType[] = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const currentLevelIndex = levels.indexOf(this.level)
    const messageLevelIndex = levels.indexOf(level)
    
    return messageLevelIndex >= currentLevelIndex
  }

  // Debug log
  debug(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.prefix, ...args)
    }
  }

  // Info log
  info(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.prefix, ...args)
    }
  }

  // Warn log
  warn(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.prefix, ...args)
    }
  }

  // Error log
  error(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.prefix, ...args)
    }
  }

  // Log (alias for info)
  log(...args: unknown[]): void {
    this.info(...args)
  }
}

// Export singleton getter
export const getLogger = (options?: LoggerOptions): Logger => {
  return Logger.getInstance(options)
}

// Export default logger instance
export const logger = Logger.getInstance()

// Export class for type usage
export { Logger }
