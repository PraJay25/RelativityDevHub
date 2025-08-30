#!/bin/bash

echo "🚀 Deploying Auth Service to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the auth-service directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

# Test the build
echo "🧪 Testing the build..."
node test-vercel-build.js

if [ $? -ne 0 ]; then
    echo "❌ Build test failed. Please fix the issues before deploying."
    exit 1
fi

echo "✅ Build test passed!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check your Vercel dashboard for the deployment status"
echo "2. Test the health endpoint: https://your-project.vercel.app/api/v1/health"
echo "3. Test user registration and login endpoints"
echo "4. Update CORS_ORIGIN with your frontend domain if needed"
echo ""
echo "📚 For more details, see: VERCEL_DEPLOYMENT_GUIDE.md"
