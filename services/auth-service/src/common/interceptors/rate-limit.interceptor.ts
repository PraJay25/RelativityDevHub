import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThrottlerException } from '@nestjs/throttler';

/**
 * Rate limiting interceptor
 * Handles rate limiting errors and provides custom error messages
 */
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  /**
   * Intercept requests and handle rate limiting
   * @param context - The execution context
   * @param next - The call handler
   * @returns Observable with rate limiting applied
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ThrottlerException) {
          const request = context.switchToHttp().getRequest();
          const response = context.switchToHttp().getResponse();
          
          // Get rate limit headers
          const limit = response.getHeader('X-RateLimit-Limit');
          const remaining = response.getHeader('X-RateLimit-Remaining');
          const reset = response.getHeader('X-RateLimit-Reset');

          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.TOO_MANY_REQUESTS,
                  message: 'Rate limit exceeded. Please try again later.',
                  error: 'Too Many Requests',
                  timestamp: new Date().toISOString(),
                  path: request.url,
                  rateLimit: {
                    limit,
                    remaining,
                    reset,
                  },
                },
                HttpStatus.TOO_MANY_REQUESTS,
              ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
