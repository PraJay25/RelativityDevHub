import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Custom logger service using Winston
 * Provides structured logging with file rotation and different log levels
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'auth-service' },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        // File transport for errors
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // File transport for all logs
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  /**
   * Log a message with debug level
   * @param message - The message to log
   * @param context - Optional context for the log
   */
  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  /**
   * Log a message with error level
   * @param message - The message to log
   * @param trace - Optional stack trace
   * @param context - Optional context for the log
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  /**
   * Log a message with warn level
   * @param message - The message to log
   * @param context - Optional context for the log
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  /**
   * Log a message with debug level
   * @param message - The message to log
   * @param context - Optional context for the log
   */
  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  /**
   * Log a message with verbose level
   * @param message - The message to log
   * @param context - Optional context for the log
   */
  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  /**
   * Log a message with custom metadata
   * @param level - The log level
   * @param message - The message to log
   * @param meta - Additional metadata
   */
  logWithMeta(level: string, message: string, meta: Record<string, unknown>): void {
    this.logger.log(level, message, meta);
  }

  /**
   * Log performance metrics
   * @param operation - The operation being measured
   * @param duration - Duration in milliseconds
   * @param context - Optional context
   */
  logPerformance(operation: string, duration: number, context?: string): void {
    this.logger.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      context,
      type: 'performance',
    });
  }

  /**
   * Log security events
   * @param event - The security event
   * @param details - Event details
   * @param userId - Optional user ID
   */
  logSecurityEvent(event: string, details: Record<string, unknown>, userId?: string): void {
    this.logger.warn(`Security Event: ${event}`, {
      event,
      details,
      userId,
      type: 'security',
    });
  }
}
