import { Request, Response } from 'express';
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

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

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://relativity-idea.vercel.app',
      process.env.CORS_ORIGIN,
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
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./api/index.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI setup
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: 'RelativityDevHub Auth API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  }),
);

// Health check endpoint
/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the authentication service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-30T04:37:10.676Z"
 *                 service:
 *                   type: string
 *                   example: "auth-service"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 environment:
 *                   type: string
 *                   example: "production"
 */
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Login endpoint
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "SecurePassword123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login endpoint - NestJS integration pending"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-30T04:37:10.676Z"
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login endpoint - NestJS integration pending',
    timestamp: new Date().toISOString(),
  });
});

// Register endpoint
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "SecurePassword123!"
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 description: Password confirmation
 *                 example: "SecurePassword123!"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register endpoint - NestJS integration pending"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-30T04:37:10.676Z"
 *       400:
 *         description: Bad request - validation failed
 *       409:
 *         description: User already exists
 */
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  res.status(201).json({
    message: 'Register endpoint - NestJS integration pending',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

// Export the serverless handler
export default serverless(app);
