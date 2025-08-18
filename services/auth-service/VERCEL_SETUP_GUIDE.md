# 🚀 Vercel Deployment Step-by-Step Guide

## Step 1: Set up PostgreSQL Database (Supabase)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project:
   - Project name: `relativity-devhub-auth`
   - Database password: Choose a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"

### 1.2 Get Database Connection String
1. In Supabase Dashboard, go to **Settings > Database**
2. Copy the connection string from "Connection string" section
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.3 Test Database Connection
```bash
# Set your DATABASE_URL
export DATABASE_URL="your-supabase-connection-string"

# Test the connection
node test-db-connection.js
```

## Step 2: Install Vercel CLI and Login

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

## Step 3: Configure Environment Variables

### 3.1 Generate Strong JWT Secrets
```bash
# Generate JWT secrets (run these commands)
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2 Prepare Environment Variables
Create these environment variables for Vercel:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` | Your Supabase connection string |
| `JWT_SECRET` | `[GENERATED-32-CHAR-SECRET]` | JWT signing secret |
| `JWT_REFRESH_SECRET` | `[GENERATED-32-CHAR-SECRET]` | JWT refresh secret |
| `CORS_ORIGIN` | `https://your-frontend-domain.vercel.app` | Your frontend domain |

## Step 4: Deploy to Vercel

### 4.1 Initial Deployment
```bash
# Make sure you're in the auth-service directory
cd services/auth-service

# Deploy to Vercel
vercel
```

### 4.2 Follow the Prompts
- Link to existing project: **No** (create new)
- Project name: `relativity-auth-service`
- Directory: `./` (current directory)
- Override settings: **No**

### 4.3 Configure Environment Variables in Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings > Environment Variables**
4. Add each variable from Step 3.2

## Step 5: Update CORS Configuration

### 5.1 Update CORS Origins
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

### 5.2 Redeploy
```bash
vercel --prod
```

## Step 6: Run Database Migrations

### 6.1 Create Migration Endpoint (Temporary)
Add this to your health controller for one-time migration:

```typescript
@Post('migrate')
async migrate() {
  // This will run synchronize: true to create tables
  return { message: 'Migration completed' };
}
```

### 6.2 Run Migration
```bash
# Call the migration endpoint
curl -X POST https://your-auth-service.vercel.app/api/v1/health/migrate
```

## Step 7: Test Your API Endpoints

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

## Next Steps

1. **Remove temporary migration endpoint** after successful migration
2. **Set up monitoring** with Vercel Analytics
3. **Configure custom domain** if needed
4. **Set up CI/CD** with GitHub integration
5. **Monitor performance** and optimize as needed

---

**🎉 Congratulations! Your auth service is now deployed on Vercel!**
