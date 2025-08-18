import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { RateLimitInterceptor } from '../src/common/interceptors/rate-limit.interceptor';
import { LoggerService } from '../src/common/services/logger.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';

let server: any;

async function bootstrapServer() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: new LoggerService(),
  });

  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(compression());

  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages:
        configService.get<string>('NODE_ENV') === 'production',
      validationError: { target: false, value: false },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RateLimitInterceptor());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.init();
  // Bind Nest to the Express adapter for serverless runtime
  adapter.getInstance().use(expressApp);
  return serverless(adapter.getInstance());
}

export default async function handler(req: Request, res: Response) {
  if (!server) {
    server = await bootstrapServer();
  }
  return server(req, res);
}
