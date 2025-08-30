import { Request, Response } from 'express';
import serverless from 'serverless-http';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from '../dist/app.module';
import { GlobalExceptionFilter } from '../dist/common/filters/global-exception.filter';
import { RateLimitInterceptor } from '../dist/common/interceptors/rate-limit.interceptor';

let app: any;
let server: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Security middleware
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

    // Compression middleware
    app.use(compression());

    // Global prefix
    const apiPrefix = configService.get('API_PREFIX') ?? 'api/v1';
    app.setGlobalPrefix(apiPrefix);

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: configService.get('NODE_ENV') === 'production',
        validationError: {
          target: false,
          value: false,
        },
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global rate limiting interceptor
    app.useGlobalInterceptors(new RateLimitInterceptor());

    // CORS configuration
    const corsOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://relativity-idea.vercel.app',
      configService.get('CORS_ORIGIN'),
    ].filter(Boolean);

    app.enableCors({
      origin: corsOrigins.length > 0 ? corsOrigins : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
      ],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Swagger documentation setup
    if (configService.get('NODE_ENV') !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('RelativityDevHub Auth API')
        .setDescription('Authentication service for RelativityDevHub')
        .setVersion('1.0')
        .addTag('auth')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
          },
          'JWT-auth',
        )
        .addApiKey(
          {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API key for external integrations',
          },
          'API-Key',
        )
        .addServer('https://relativity-idea.vercel.app', 'Production server')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
          docExpansion: 'none',
          filter: true,
          showRequestDuration: true,
        },
        customSiteTitle: 'RelativityDevHub Auth API Documentation',
      });
    }

    await app.init();
  }
  return app;
}

async function getServer() {
  if (!server) {
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    server = serverless(expressInstance);
  }
  return server;
}

export default async function handler(req: Request, res: Response) {
  try {
    const srv = await getServer();
    return srv(req, res);
  } catch (error) {
    console.error('Handler error:', error);

    // Return a proper error response
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process request',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
