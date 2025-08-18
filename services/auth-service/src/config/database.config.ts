import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (databaseUrl) {
      // Use DATABASE_URL for Vercel/production deployment
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize:
          this.configService.get<string>('NODE_ENV') !== 'production',
        logging: this.configService.get<string>('NODE_ENV') === 'development',
        ssl:
          this.configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        extra: {
          max: 20, // Connection pool size
          connectionTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
        },
      };
    } else {
      // Use individual config for local development
      return {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST', 'localhost'),
        port: this.configService.get<number>('DB_PORT', 5432),
        username: this.configService.get<string>('DB_USERNAME', 'postgres'),
        password: this.configService.get<string>('DB_PASSWORD', 'password'),
        database: this.configService.get<string>(
          'DB_DATABASE',
          'relativity_devhub',
        ),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', true),
        logging: this.configService.get<boolean>('DB_LOGGING', true),
        ssl:
          this.configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      };
    }
  }
}
