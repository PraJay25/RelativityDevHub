# 🔧 Vercel Troubleshooting Guide

## 🚨 FUNCTION_INVOCATION_FAILED Error

If you're getting `FUNCTION_INVOCATION_FAILED` error, here are the most common causes and solutions:

### 1. **Environment Variables Missing**

**Problem**: Required environment variables are not set in Vercel.

**Solution**:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these **required** variables:

```env
# Required for basic functionality
NODE_ENV=production
DATABASE_URL=postgres://postgres.fsgcgdipqhqhxtnsykzs:vgu578pVQxmTF1qd@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
JWT_SECRET=your-super-secure-32-character-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-32-character-refresh-secret-here
API_PREFIX=api/v1
```

### 2. **Database Connection Issues**

**Problem**: The app can't connect to Supabase database.

**Solution**:

1. Verify your `DATABASE_URL` is correct
2. Check if Supabase is accessible from Vercel
3. Ensure SSL settings are correct

**Test Database Connection**:

```bash
# Test locally first
curl -X POST https://your-auth-service.vercel.app/api/v1/health
```

### 3. **Build Issues**

**Problem**: TypeScript compilation fails or missing files.

**Solution**:

1. Run locally: `npm run build`
2. Check for TypeScript errors
3. Verify all files are in `dist/` folder

### 4. **Dependencies Missing**

**Problem**: Required npm packages are not installed.

**Solution**:

1. Check `package.json` has all dependencies
2. Ensure `node_modules` is not in `.gitignore`
3. Vercel should auto-install dependencies

## 🧪 Testing Steps

### Step 1: Test Health Endpoint

```bash
curl https://relativity-idea.vercel.app/api/v1/health
```

**Expected Response**:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "auth-service",
  "version": "1.0.0",
  "environment": "production"
}
```

### Step 2: Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on "api/index.ts" or "api/health.ts"
5. Check "Logs" for error details

### Step 3: Test Local Build

```bash
cd services/auth-service
npm run build
node test-vercel-build.js
```

## 🔍 Debug Commands

### Check Vercel Function Status

```bash
# If using Vercel CLI
vercel logs
vercel ls
```

### Test Environment Variables

```bash
# Check if environment variables are loaded
curl -X GET https://your-auth-service.vercel.app/api/v1/health
```

### Force Redeploy

```bash
# Trigger a new deployment
vercel --prod
```

## 🛠️ Common Fixes

### Fix 1: Update Vercel Configuration

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/v1/health",
      "dest": "/api/health.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### Fix 2: Simplify API Handler

The current `api/index.ts` has better error handling and fallbacks.

### Fix 3: Add Health Check Endpoint

The new `api/health.ts` provides a simple health check without database dependencies.

## 📋 Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (your Supabase connection string)
- [ ] `JWT_SECRET` (32+ character secret)
- [ ] `JWT_REFRESH_SECRET` (32+ character secret)
- [ ] `API_PREFIX=api/v1`
- [ ] `CORS_ORIGIN` (your frontend domain)

## 🎯 Quick Fix Steps

1. **Check Environment Variables** in Vercel Dashboard
2. **Test Health Endpoint**: `https://relativity-idea.vercel.app/api/v1/health`
3. **Check Vercel Logs** for specific error messages
4. **Redeploy** if needed: `vercel --prod`

## 📞 If Still Not Working

1. **Check Vercel Logs** for specific error messages
2. **Verify Database Connection** - test Supabase connection
3. **Test Locally** - ensure it works on your machine
4. **Check Dependencies** - ensure all packages are in package.json

---

**The health endpoint should work even if the main app has issues. Try:**
`https://relativity-idea.vercel.app/api/v1/health`
