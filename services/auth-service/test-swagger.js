const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
          200: {
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
          200: {
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
          400: { description: 'Invalid credentials' },
          401: { description: 'Unauthorized' },
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
          201: {
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
          400: { description: 'Bad request - validation failed' },
          409: { description: 'User already exists' },
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

// Swagger UI setup
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(apiDocs, {
    customSiteTitle: 'RelativityDevHub Auth API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  }),
);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  res.status(200).json({
    message: 'Login endpoint - NestJS integration pending',
    timestamp: new Date().toISOString(),
  });
});

// Register endpoint
app.post('/api/v1/auth/register', (req, res) => {
  res.status(201).json({
    message: 'Register endpoint - NestJS integration pending',
    timestamp: new Date().toISOString(),
  });
});

// Raw API docs endpoint
app.get('/api-docs', (req, res) => {
  res.json(apiDocs);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
  console.log(`🔗 API endpoint: http://localhost:${port}/api/v1`);
  console.log(`🏥 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`📖 Raw API docs: http://localhost:${port}/api-docs`);
});
