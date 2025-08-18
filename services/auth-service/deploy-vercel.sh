#!/bin/bash

echo "🚀 Deploying RelativityDevHub Auth Service to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the auth-service directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from env.example..."
    cp env.example .env.local
    echo "📝 Please update .env.local with your production values:"
    echo "   - DATABASE_URL (your PostgreSQL connection string)"
    echo "   - JWT_SECRET (a strong secret key)"
    echo "   - CORS_ORIGIN (your frontend domain)"
    echo ""
    echo "After updating .env.local, run this script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel Dashboard"
echo "2. Set up your database and run migrations"
echo "3. Update CORS origins with your frontend domain"
echo "4. Test your API endpoints"
echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Deployment Guide: DEPLOYMENT.md"
