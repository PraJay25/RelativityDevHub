import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';

/**
 * Bootstrap the application
 * Sets up security, validation, documentation, and performance optimizations
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  // no-op logger in production

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
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages:
        configService.get<string>('NODE_ENV') === 'production',
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

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle(
      configService.get<string>('SWAGGER_TITLE', 'RelativityDevHub Auth API'),
    )
    .setDescription(
      configService.get<string>(
        'SWAGGER_DESCRIPTION',
        'Authentication service for RelativityDevHub',
      ),
    )
    .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0'))
    .addTag(configService.get<string>('SWAGGER_TAG', 'auth'))
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
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.relativitydevhub.com', 'Production server')
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

  // Start the application
  const port = configService.get<number>('PORT', 3001);

  // For Vercel serverless deployment
  if (process.env.VERCEL) {
    await app.listen(port);
  } else {
    await app.listen(port, '0.0.0.0');
  }

  // Minimal console outputs only in non-serverless local dev
  if (!process.env.VERCEL) {
    // eslint-disable-next-line no-console
    console.log(`Auth service listening on :${port}`);
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
