# 🚀 Complete Vercel Deployment Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository pushed to GitHub
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Supabase account created at [supabase.com](https://supabase.com)

## Step 1: Set up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project:
   - **Project name**: `relativity-devhub-auth`
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
   - Click "Create new project"

### 1.2 Get Database Connection String
1. In Supabase Dashboard → **Settings** → **Database**
2. Copy the connection string from "Connection string" section
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.3 Test Database Connection
```bash
# Set your DATABASE_URL (replace with your actual connection string)
$env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Test the connection
node test-db-connection.js
```

## Step 2: Generate Production Secrets

Run this command to generate secure JWT secrets:
```bash
node generate-secrets.js
```

**Save these secrets securely!** You'll need them for Vercel environment variables.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**:
   - Select your `RelativityDevHub` repository
   - Set **Root Directory** to: `services/auth-service`
   - Set **Framework Preset** to: `Other`
   - Set **Build Command** to: `npm run build`
   - Set **Output Directory** to: `dist`
   - Set **Install Command** to: `npm install`
4. **Click "Deploy"**

### Option B: Using Vercel CLI (Alternative)

If the CLI login works:
```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 4: Configure Environment Variables

### 4.1 In Vercel Dashboard
1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` | Production |
| `JWT_SECRET` | `[GENERATED-SECRET-FROM-STEP-2]` | Production |
| `JWT_REFRESH_SECRET` | `[GENERATED-SECRET-FROM-STEP-2]` | Production |
| `CORS_ORIGIN` | `https://your-frontend-domain.vercel.app` | Production |

### 4.2 Update CORS Configuration

Edit `src/main.vercel.ts` and update the CORS origins:
```typescript
app.enableCors({
  origin: [
    'https://your-actual-frontend-domain.vercel.app',
    'https://your-actual-frontend-domain.com',
    'http://localhost:3000', // For local development
    configService.get<string>('CORS_ORIGIN'),
  ].filter(Boolean),
  // ... rest of config
});
```

## Step 5: Redeploy with Updated Configuration

```bash
# If using CLI
vercel --prod

# Or trigger a new deployment from Vercel Dashboard
```

## Step 6: Run Database Migration

### 6.1 Call Migration Endpoint
```bash
# Replace with your actual Vercel URL
curl -X POST https://your-auth-service.vercel.app/api/v1/health/migrate
```

### 6.2 Verify Tables Created
The migration endpoint will trigger TypeORM to create the necessary tables.

## Step 7: Test Your API

### 7.1 Health Check
```bash
curl https://your-auth-service.vercel.app/api/v1/health
```

### 7.2 Test User Registration
```bash
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "Password123!",
    "passwordConfirmation": "Password123!"
  }'
```

### 7.3 Test User Login
```bash
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

## Step 8: Verify Deployment

### 8.1 Check Vercel Dashboard
- Go to your project dashboard
- Check **Functions** tab for any errors
- Check **Deployments** tab for build status

### 8.2 Test Swagger Documentation
- Visit: `https://your-auth-service.vercel.app/docs`
- Test the endpoints through Swagger UI

## Step 9: Clean Up

### 9.1 Remove Migration Endpoint
After successful migration, remove the temporary migration endpoint from `src/health/health.controller.ts`.

### 9.2 Redeploy
```bash
vercel --prod
```

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify SSL settings
   - Ensure database is accessible from Vercel

2. **CORS Errors**
   - Update CORS origins with correct frontend domain
   - Check if frontend is making requests to correct URL

3. **Function Timeout**
   - Increase `maxDuration` in vercel.json
   - Optimize database queries

4. **Build Errors**
   - Check TypeScript compilation
   - Verify all dependencies are in package.json

### Debug Commands:
```bash
# View deployment logs
vercel logs

# Check function status
vercel ls

# Redeploy with debug info
vercel --debug
```

## Environment Variables Reference

Here's a complete list of environment variables you need:

```env
# Application
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT (Generated from generate-secrets.js)
JWT_SECRET=[GENERATED-32-CHAR-SECRET]
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=[GENERATED-32-CHAR-SECRET]
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

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Logging
LOG_LEVEL=info
```

## Next Steps

1. **Set up monitoring** with Vercel Analytics
2. **Configure custom domain** if needed
3. **Set up CI/CD** with GitHub integration
4. **Monitor performance** and optimize as needed
5. **Set up alerts** for function errors

---

**🎉 Congratulations! Your auth service is now deployed on Vercel!**

Your API will be available at: `https://your-auth-service.vercel.app`
Swagger documentation at: `https://your-auth-service.vercel.app/docs`
