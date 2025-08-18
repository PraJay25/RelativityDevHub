import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs/redis';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';
import { JwtConfig } from './config/jwt.config';
import { LoggerService } from './common/services/logger.service';

/**
 * Main application module
 * Configures all core modules and dependencies
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'env.example'],
      validationSchema: {
        type: 'object',
        required: ['DB_HOST', 'DB_PASSWORD', 'JWT_SECRET'],
        properties: {
          NODE_ENV: {
            type: 'string',
            enum: ['development', 'production', 'test'],
            default: 'development',
          },
          PORT: {
            type: 'number',
            default: 3001,
          },
          DB_HOST: {
            type: 'string',
          },
          DB_PASSWORD: {
            type: 'string',
          },
          JWT_SECRET: {
            type: 'string',
            minLength: 32,
          },
        },
      },
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
      inject: [ConfigService],
    }),

    // Redis
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfig,
      inject: [ConfigService],
    }),

    // JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
      inject: [ConfigService],
    }),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('RATE_LIMIT_TTL', 60),
        limit: config.get<number>('RATE_LIMIT_LIMIT', 100),
      }),
    }),

    // Background jobs
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD', ''),
          db: config.get<number>('REDIS_DB', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
    }),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [
    LoggerService,
    {
      provide: 'LOGGER',
      useExisting: LoggerService,
    },
  ],
  exports: [LoggerService],
})
export class AppModule {}
