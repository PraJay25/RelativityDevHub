# Vercel Deployment Guide

This guide will help you deploy the RelativityDevHub Auth Service to Vercel.

## 🚀 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Database**: You'll need a PostgreSQL database (recommended: Supabase, Railway, or Neon)
4. **Environment Variables**: Configure all required environment variables

## 📋 Step-by-Step Deployment

### 1. Database Setup

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your database connection string from Settings > Database
3. Use the connection string format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B: Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Add a PostgreSQL database
3. Get your connection string from the database settings

#### Option C: Neon

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Get your connection string from the dashboard

### 2. Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```env
# Application
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1

# Database (PostgreSQL) - Replace with your database URL
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Swagger
SWAGGER_TITLE=RelativityDevHub Auth API
SWAGGER_DESCRIPTION=Authentication service for RelativityDevHub
SWAGGER_VERSION=1.0
SWAGGER_TAG=auth

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# CORS - Replace with your frontend domain
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Logging
LOG_LEVEL=info
```

### 3. Update Database Configuration

Update `src/config/database.config.ts` to use the DATABASE_URL:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Login to Vercel**:

   ```bash
   vercel login
   ```

2. **Deploy the project**:

   ```bash
   cd services/auth-service
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Set project name (e.g., `relativity-auth-service`)
   - Confirm deployment settings

#### Option B: Using Vercel Dashboard

1. **Push your code to GitHub**
2. **Go to Vercel Dashboard**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project**:
   - Framework Preset: Other
   - Root Directory: `services/auth-service`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 5. Configure Environment Variables in Vercel

1. **Go to your project dashboard in Vercel**
2. **Navigate to Settings > Environment Variables**
3. **Add all environment variables from your `.env.local` file**

### 6. Database Migration

After deployment, you need to run database migrations:

1. **Access your deployed function**:

   ```bash
   vercel env pull .env.local
   ```

2. **Run migrations locally** (if you have database access):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Or create a migration endpoint** (temporary):
   Add this to your health controller for one-time migration:

```typescript
@Post('migrate')
async migrate() {
  // Run your migration logic here
  return { message: 'Migration completed' };
}
```

### 7. Update CORS Configuration

Update the CORS origins in `src/main.vercel.ts` with your actual frontend domain:

```typescript
app.enableCors({
  origin: [
    'https://your-actual-frontend-domain.vercel.app',
    'https://your-actual-frontend-domain.com',
    configService.get<string>('CORS_ORIGIN'),
  ].filter(Boolean),
  // ... rest of config
});
```

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. **Go to Vercel Dashboard > Settings > Domains**
2. **Add your custom domain** (e.g., `api.yourdomain.com`)
3. **Configure DNS records** as instructed by Vercel

### 2. Environment Variables for Different Environments

Set up different environment variables for Preview and Production:

1. **Go to Settings > Environment Variables**
2. **Add variables for each environment**:
   - Production: `NODE_ENV=production`
   - Preview: `NODE_ENV=staging`

### 3. Monitoring and Logs

1. **View function logs** in Vercel Dashboard > Functions
2. **Set up monitoring** with Vercel Analytics
3. **Configure alerts** for function errors

## 🧪 Testing Your Deployment

### 1. Health Check

```bash
curl https://your-auth-service.vercel.app/api/v1/health
```

### 2. Test Authentication

```bash
# Register a user
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'

# Login
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Considerations

### 1. Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use Vercel's environment variable system
- ✅ Rotate JWT secrets regularly
- ✅ Use strong, unique passwords

### 2. Database Security

- ✅ Enable SSL connections
- ✅ Use connection pooling
- ✅ Implement proper backup strategies
- ✅ Monitor database access

### 3. API Security

- ✅ Enable rate limiting
- ✅ Implement proper CORS policies
- ✅ Use HTTPS only
- ✅ Validate all inputs

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check DATABASE_URL format
   - Verify SSL settings
   - Ensure database is accessible from Vercel

2. **CORS Errors**:
   - Update CORS origins with correct frontend domain
   - Check if frontend is making requests to correct URL

3. **Function Timeout**:
   - Increase `maxDuration` in vercel.json
   - Optimize database queries
   - Use connection pooling

4. **Build Errors**:
   - Check TypeScript compilation
   - Verify all dependencies are in package.json
   - Check for missing environment variables

### Debug Commands

```bash
# View deployment logs
vercel logs

# Check function status
vercel ls

# Redeploy with debug info
vercel --debug

# Pull environment variables
vercel env pull .env.local
```

## 📈 Performance Optimization

1. **Database Optimization**:
   - Use connection pooling
   - Implement proper indexing
   - Optimize queries

2. **Caching**:
   - Implement Redis caching (if needed)
   - Use Vercel's edge caching
   - Cache static responses

3. **Monitoring**:
   - Set up Vercel Analytics
   - Monitor function execution times
   - Track error rates

## 🔄 Continuous Deployment

1. **Connect GitHub repository** to Vercel
2. **Enable automatic deployments** on push
3. **Set up branch deployments** for staging
4. **Configure preview deployments** for pull requests

## 📞 Support

If you encounter issues:

1. **Check Vercel documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **View function logs** in Vercel Dashboard
3. **Check NestJS documentation**: [nestjs.com](https://nestjs.com)
4. **Create an issue** in the project repository

---

**Happy Deploying! 🚀**
