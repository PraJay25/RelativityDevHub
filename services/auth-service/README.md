# Auth Service

A comprehensive authentication service built with NestJS, TypeScript, and PostgreSQL for the RelativityDevHub platform.

## 🚀 Features

- **User Authentication**: Registration, login, and JWT token management
- **Role-Based Access Control**: Admin, User, and Reviewer roles
- **Swagger Documentation**: Interactive API documentation
- **Database Integration**: PostgreSQL with TypeORM
- **Security Features**: CORS, Helmet, rate limiting, bcrypt password hashing
- **Docker Support**: Containerized deployment
- **Comprehensive Testing**: Unit and integration tests

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)
- npm or yarn

## 🛠️ Installation

### Quick Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd services/auth-service
   ```

2. **Run the automated setup**

   ```bash
   npm run setup
   ```

   This will automatically:
   - ✅ Check Node.js and npm versions
   - ✅ Create `.env` file with proper configuration
   - ✅ Install all dependencies
   - ✅ Check PostgreSQL and Redis connections
   - ✅ Set up database (create, migrate, seed)
   - ✅ Provide next steps

### Manual Setup (Alternative)

If you prefer manual setup or the automated setup fails:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=admin123
   DB_DATABASE=relativity_devhub

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # Server
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database**

   ```bash
   # Create database
   npm run db:create

   # Run migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed
   ```

## 🏃‍♂️ Running the Service

### Development Mode

```bash
npm run dev:swagger
```

### Production Mode

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
```

## 📚 API Documentation

Once the service is running, access the Swagger documentation at:

- **Swagger UI**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health
- **API Base**: http://localhost:3001/api/v1

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Token

```http
GET /api/v1/auth/verify
Authorization: Bearer <jwt_token>
```

## 👥 User Management Endpoints

### Get Current User Profile

```http
GET /api/v1/users/profile
Authorization: Bearer <jwt_token>
```

### Get All Users (Admin Only)

```http
GET /api/v1/users
Authorization: Bearer <jwt_token>
```

### Get User by ID (Admin Only)

```http
GET /api/v1/users/{id}
Authorization: Bearer <jwt_token>
```

### Update User Status (Admin Only)

```http
PATCH /api/v1/users/{id}/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "active"
}
```

### Update User Role (Admin Only)

```http
PATCH /api/v1/users/{id}/role
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "admin"
}
```

## 🧪 Pre-configured Test Users

The service comes with pre-configured users for testing:

| Email                         | Password | Role     | Status |
| ----------------------------- | -------- | -------- | ------ |
| admin@relativitydevhub.com    | admin123 | admin    | active |
| user@relativitydevhub.com     | user123  | user     | active |
| reviewer@relativitydevhub.com | user123  | reviewer | active |

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── decorators/       # Custom decorators
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Authentication guards
│   └── strategies/      # Passport strategies
├── users/               # User management module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── dto/             # User DTOs
│   └── entities/        # User entity
├── common/              # Shared components
│   ├── filters/         # Exception filters
│   ├── interceptors/    # Request interceptors
│   └── services/        # Shared services
├── config/              # Configuration files
├── health/              # Health check controller
├── routes/              # Express routes (for simple version)
├── main.ts              # NestJS main file
├── main-simple.ts       # Express.js simple version
└── main-swagger.ts      # Express.js with Swagger
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description         | Default           |
| ---------------- | ------------------- | ----------------- |
| `DB_HOST`        | PostgreSQL host     | localhost         |
| `DB_PORT`        | PostgreSQL port     | 5432              |
| `DB_USERNAME`    | Database username   | postgres          |
| `DB_PASSWORD`    | Database password   | -                 |
| `DB_DATABASE`    | Database name       | relativity_devhub |
| `JWT_SECRET`     | JWT signing secret  | -                 |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h               |
| `PORT`           | Server port         | 3001              |
| `NODE_ENV`       | Environment         | development       |

### Database Schema

The service creates the following table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🐳 Docker

### Build Image

```bash
docker build -t auth-service .
```

### Run Container

```bash
docker run -p 3001:3001 auth-service
```

### Docker Compose

```bash
docker-compose up -d
```

## 📝 Scripts

| Script                | Description                           |
| --------------------- | ------------------------------------- |
| `npm run dev:swagger` | Start development server with Swagger |
| `npm run dev:simple`  | Start simple Express.js server        |
| `npm run build`       | Build for production                  |
| `npm start`           | Start production server               |
| `npm test`            | Run tests                             |
| `npm run db:create`   | Create database                       |
| `npm run db:migrate`  | Run database migrations               |
| `npm run db:seed`     | Seed database with initial data       |

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable cross-origin requests
- **Rate Limiting**: Request throttling
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Parameterized queries
- **Helmet**: Security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`
