import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';

let app: any;

async function bootstrap(): Promise<any> {
  if (!app) {
    app = await NestFactory.create(AppModule as any);

    const configService = app.get(ConfigService as any);

    // Security middleware
    (app as any).use(
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
    (app as any).use(compression());

    // Global prefix
    const apiPrefix = (configService.get('API_PREFIX') as string) ?? 'api/v1';
    (app as any).setGlobalPrefix(apiPrefix);

    // Global validation pipe with strict settings
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: true,
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

    // CORS configuration for production
    app.enableCors({
      origin: [
        'https://your-frontend-domain.vercel.app',
        'https://your-frontend-domain.com',
        (configService.get('CORS_ORIGIN') as string) ??
          'https://your-frontend-domain.vercel.app',
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
      ],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Swagger documentation setup (only in development)
    if ((configService.get('NODE_ENV') as string) !== 'production') {
      const config = new DocumentBuilder()
        .setTitle(
          (configService.get('SWAGGER_TITLE') as string) ??
            'RelativityDevHub Auth API',
        )
        .setDescription(
          (configService.get('SWAGGER_DESCRIPTION') as string) ??
            'Authentication service for RelativityDevHub',
        )
        .setVersion((configService.get('SWAGGER_VERSION') as string) ?? '1.0')
        .addTag((configService.get('SWAGGER_TAG') as string) ?? 'auth')
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
        .addServer('https://your-auth-service.vercel.app', 'Production server')
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

// Export for Vercel serverless functions
export default bootstrap;
