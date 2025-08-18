import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions, RedisOptionsFactory } from '@nestjs/redis';

@Injectable()
export class RedisConfig implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      config: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD', ''),
        db: this.configService.get<number>('REDIS_DB', 0),
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      },
    };
  }
}
