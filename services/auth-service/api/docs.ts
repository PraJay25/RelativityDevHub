import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Security middleware - Disable CSP for Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://relativity-idea.vercel.app',
    ],
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
  }),
);

// Manual API documentation
const apiDocs = {
  openapi: '3.0.0',
  info: {
    title: 'RelativityDevHub Auth API',
    version: '1.0.0',
    description:
      'Authentication service for RelativityDevHub - API documentation for developers',
    contact: {
      name: 'RelativityDevHub Team',
      email: 'support@relativitydevhub.com',
    },
  },
  servers: [
    {
      url: 'https://relativity-idea.vercel.app',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/v1/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns the health status of the authentication service',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                    service: { type: 'string', example: 'auth-service' },
                    version: { type: 'string', example: '1.0.0' },
                    environment: { type: 'string', example: 'production' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'User login',
        description: 'Authenticate a user and return JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: "User's email address",
                    example: 'john.doe@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: "User's password",
                    example: 'SecurePassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid credentials' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'User registration',
        description: 'Register a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'email',
                  'firstName',
                  'lastName',
                  'password',
                  'passwordConfirmation',
                ],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: "User's email address",
                    example: 'john.doe@example.com',
                  },
                  firstName: {
                    type: 'string',
                    description: "User's first name",
                    example: 'John',
                  },
                  lastName: {
                    type: 'string',
                    description: "User's last name",
                    example: 'Doe',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: "User's password",
                    example: 'SecurePassword123!',
                  },
                  passwordConfirmation: {
                    type: 'string',
                    format: 'password',
                    description: 'Password confirmation',
                    example: 'SecurePassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registration successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request - validation failed' },
          '409': { description: 'User already exists' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Raw API docs endpoint
app.get('/api-docs', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(apiDocs);
});

// Swagger UI setup
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(apiDocs, {
  customSiteTitle: 'RelativityDevHub Auth API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

export default app;
