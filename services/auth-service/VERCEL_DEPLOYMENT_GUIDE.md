# 🚀 Vercel Deployment Guide - Auth Service

## ✅ Pre-Deployment Checklist

- [x] TypeScript compilation works (`npm run build`)
- [x] All required files are generated in `dist/` folder
- [x] Vercel configuration is correct (`vercel.json`)
- [x] API handler is properly set up (`api/index.ts`)
- [x] Environment variables are ready

## 📋 Vercel Project Settings

### 1. Project Configuration

- **Root Directory**: `services/auth-service`
- **Framework Preset**: `Other`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. Environment Variables (Production)

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```env
# Application
NODE_ENV=production
API_PREFIX=api/v1
PORT=3001

# Database (Supabase)
DATABASE_URL=postgres://postgres.fsgcgdipqhqhxtnsykzs:vgu578pVQxmTF1qd@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# JWT Secrets (Generate secure ones!)
JWT_SECRET=your-super-secure-32-character-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-32-character-refresh-secret-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Update with your actual frontend domain)
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Swagger (Optional)
SWAGGER_TITLE=RelativityDevHub Auth API
SWAGGER_DESCRIPTION=Authentication service for RelativityDevHub
SWAGGER_VERSION=1.0
SWAGGER_TAG=auth
```

## 🔧 Files Structure for Vercel

```
services/auth-service/
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── src/
│   ├── main.vercel.ts    # NestJS bootstrap for Vercel
│   ├── app.module.ts     # Main application module
│   └── ...               # Other source files
├── dist/                 # Built files (generated)
│   ├── api/
│   │   └── index.js      # Compiled serverless function
│   ├── main.vercel.js    # Compiled bootstrap
│   └── ...               # Other compiled files
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Deployment Steps

### Option 1: Vercel Dashboard (Recommended)

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Root Directory: `services/auth-service`
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Add Environment Variables** (see above)
6. **Click "Deploy"**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from services/auth-service directory)
cd services/auth-service
vercel --prod
```

## 🧪 Testing Your Deployment

### 1. Health Check

```bash
curl https://your-auth-service.vercel.app/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "auth-service",
  "version": "1.0.0"
}
```

### 2. Test User Registration

```bash
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "SecurePass123!",
    "passwordConfirmation": "SecurePass123!"
  }'
```

### 3. Test User Login

```bash
curl -X POST https://your-auth-service.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

## 🔍 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check Vercel function logs
   - Verify environment variables are set
   - Check if database connection works

2. **Build Failures**
   - Run `npm run build` locally to test
   - Check TypeScript compilation errors
   - Verify all dependencies are in package.json

3. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check if Supabase is accessible
   - Ensure SSL settings are correct

4. **CORS Errors**
   - Update CORS_ORIGIN with your frontend domain
   - Check if frontend is making requests to correct URL

### Debug Commands

```bash
# Test build locally
npm run build

# Test build verification
node test-vercel-build.js

# Check Vercel logs
vercel logs

# Redeploy with debug info
vercel --debug
```

### Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on "api/index.ts"
5. Check "Logs" for error details

## 📊 Monitoring

### Vercel Analytics

- Function execution times
- Error rates
- Request volume

### Database Monitoring

- Connection pool usage
- Query performance
- Error rates

## 🔒 Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] HTTPS is enforced
- [ ] Environment variables are secure

## 🎉 Success Indicators

- ✅ Health endpoint returns 200
- ✅ User registration works
- ✅ User login works
- ✅ JWT tokens are generated
- ✅ Database operations succeed
- ✅ No CORS errors in browser console

---

**Your auth service is now ready for production! 🚀**

API Base URL: `https://your-auth-service.vercel.app/api/v1`
Health Check: `https://your-auth-service.vercel.app/api/v1/health`
