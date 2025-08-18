import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string): void {}
  error(message: string): void {}
  warn(message: string): void {}
  debug(message: string): void {}
  verbose(message: string): void {}
}
