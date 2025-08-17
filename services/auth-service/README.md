# Auth Service

Authentication and authorization service for RelativityDevHub. This service handles user registration, login, JWT token management, and role-based access control with enterprise-grade security and performance features.

## 🚀 Features

- **User Registration & Login** - Secure user authentication with bcrypt password hashing
- **JWT Token Management** - Stateless authentication with token refresh
- **Role-Based Access Control** - Admin, User, and Reviewer roles with custom decorators
- **User Management** - CRUD operations for user accounts with soft delete
- **Swagger Documentation** - Interactive API documentation with authentication
- **PostgreSQL Integration** - Reliable data persistence with TypeORM
- **Redis Caching** - Session management and caching with BullMQ
- **Rate Limiting** - Configurable rate limiting per endpoint
- **Security Headers** - Helmet.js for security headers
- **Structured Logging** - Winston with file rotation and JSON formatting
- **Background Jobs** - BullMQ for async processing
- **Health Checks** - Application health monitoring
- **Docker Support** - Containerized deployment with multi-stage builds
- **Comprehensive Testing** - Unit, integration, and E2E tests

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   PostgreSQL    │    │     Redis       │
│   (NestJS)      │◄──►│   (Database)    │    │   (Cache/Queue) │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌─────────────────────────────────────────────────────────────┐
    │                    Security Layer                          │
    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
    │  │   Helmet    │ │ Rate Limiting│ │   CORS     │ │ JWT Auth│ │
    │  │  (Headers)  │ │   (Throttler)│ │ (Config)   │ │ (Guard) │ │
    │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
    └─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Option 1: Local Development

1. **Clone and navigate to the service**
   ```bash
   cd services/auth-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL and Redis**
   ```bash
   # Using Docker
   docker run -d --name postgres -e POSTGRES_DB=relativity_devhub -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

5. **Run database migrations**
   ```bash
   npm run migration:run
   ```

6. **Start the service**
   ```bash
   npm run start:dev
   ```

### Option 2: Docker Development

1. **Navigate to the service**
   ```bash
   cd services/auth-service
   ```

2. **Start all services**
   ```bash
   make docker-up
   ```

3. **View logs**
   ```bash
   make docker-logs
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Service port | `3001` | No |
| `API_PREFIX` | API route prefix | `api/v1` | No |
| `DB_HOST` | PostgreSQL host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | No |
| `DB_USERNAME` | Database username | `postgres` | No |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_DATABASE` | Database name | `relativity_devhub` | No |
| `REDIS_HOST` | Redis host | `localhost` | No |
| `REDIS_PORT` | Redis port | `6379` | No |
| `REDIS_PASSWORD` | Redis password | - | No |
| `REDIS_DB` | Redis database | `0` | No |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | `24h` | No |
| `RATE_LIMIT_TTL` | Rate limit window | `60` | No |
| `RATE_LIMIT_LIMIT` | Rate limit requests | `100` | No |
| `CORS_ORIGIN` | CORS origin | `*` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

## 📚 API Documentation

Once the service is running, visit:
- **Swagger UI**: http://localhost:3001/docs
- **API Base URL**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/health

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!",
  "passwordConfirmation": "SecurePassword123!",
  "role": "user"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <jwt-token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <jwt-token>
```

### User Management Endpoints

#### Get All Users (Admin only)
```http
GET /api/v1/users
Authorization: Bearer <jwt-token>
```

#### Get User by ID
```http
GET /api/v1/users/{id}
Authorization: Bearer <jwt-token>
```

#### Update User
```http
PATCH /api/v1/users/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Delete User (Admin only)
```http
DELETE /api/v1/users/{id}
Authorization: Bearer <jwt-token>
```

## 🔐 Security Features

- **Password Hashing** - bcrypt with 12 salt rounds
- **JWT Authentication** - Stateless token-based auth with refresh
- **Role-Based Access** - Admin, User, Reviewer roles with guards
- **Input Validation** - Comprehensive DTO validation with class-validator
- **Rate Limiting** - Configurable rate limiting with ThrottlerModule
- **Security Headers** - Helmet.js for security headers
- **CORS Protection** - Configurable cross-origin policies
- **Error Sanitization** - Sanitized error messages in production
- **SQL Injection Prevention** - TypeORM with parameterized queries
- **XSS Protection** - Input sanitization and output encoding

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
```

### Enums
```sql
CREATE TYPE user_role AS ENUM ('admin', 'user', 'reviewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint

# Format code
npm run format
```

### Test Coverage
- Unit tests for all services
- Integration tests for all endpoints
- Authentication and authorization tests
- Error handling tests
- Rate limiting tests
- Database transaction tests

## 🐳 Docker Commands

```bash
# Build image
make docker-build

# Start services
make docker-up

# Stop services
make docker-down

# View logs
make docker-logs

# Run tests in container
docker-compose exec auth-service npm run test
```

## 📊 Monitoring & Logging

### Logging Features
- **Structured Logging** - JSON format with Winston
- **File Rotation** - Daily log rotation with compression
- **Log Levels** - Debug, info, warn, error levels
- **Performance Logging** - Request timing and performance metrics
- **Security Logging** - Authentication and authorization events
- **Error Tracking** - Detailed error logging with stack traces

### Health Checks
- **Application Health** - Overall application status
- **Database Health** - PostgreSQL connection and query health
- **Redis Health** - Cache and queue health
- **Dependency Health** - External service health

### Metrics
- **Response Times** - API endpoint performance
- **Error Rates** - Application error tracking
- **Resource Usage** - Memory and CPU monitoring
- **Business Metrics** - User registration, login success rates

## 🔄 Development Workflow

1. **Start development environment**
   ```bash
   make quick-start
   ```

2. **Make changes** - The service will auto-reload

3. **Run tests**
   ```bash
   npm run test
   ```

4. **Check code quality**
   ```bash
   npm run lint
   npm run format
   ```

5. **Commit changes** - Follow conventional commits

## 🚀 Production Deployment

### Docker Production
```bash
# Build production image
docker build -t relativity-devhub/auth-service:latest .

# Run with environment variables
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  relativity-devhub/auth-service:latest
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: relativity-devhub/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔧 Code Quality

### ESLint Rules
- Strict TypeScript rules
- No explicit any types
- Consistent code style
- Security best practices
- Performance optimizations

### Prettier Configuration
- Single quotes
- Trailing commas
- 80 character line length
- Consistent formatting

### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Strict null checks
- Exact optional property types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and formatting
6. Submit a pull request

### Commit Convention
```
type(scope): description

feat(auth): add password reset functionality
fix(users): resolve email validation issue
docs(api): update authentication endpoints
test(auth): add login failure test cases
```

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Services

- **API Gateway** - Request routing and rate limiting
- **User Service** - Extended user management
- **Notification Service** - Email and push notifications
- **Audit Service** - Security audit logging

---

*RelativityDevHub Auth Service: Enterprise-grade authentication for eDiscovery platforms.*
