#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up RelativityDevHub Auth Service...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error(
    '❌ Node.js version 18+ is required. Current version:',
    nodeVersion,
  );
  process.exit(1);
}
console.log('✅ Node.js version:', nodeVersion);

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log('✅ npm version:', npmVersion);
} catch (error) {
  console.error('❌ npm is not installed or not available');
  process.exit(1);
}

// Create .env file with proper configuration
const envContent = `# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin123
DB_DATABASE=relativity_devhub
DB_SYNCHRONIZE=true
DB_LOGGING=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

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

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
`;

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created with proper configuration');
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Check database connection
console.log('\n🔍 Checking database connection...');
try {
  // Try to connect to PostgreSQL
  execSync('psql -h localhost -U postgres -d postgres -c "SELECT 1;"', {
    stdio: 'pipe',
    env: { ...process.env, PGPASSWORD: 'admin123' },
  });
  console.log('✅ PostgreSQL connection successful');
} catch (error) {
  console.log(
    '⚠️  PostgreSQL connection failed. Make sure PostgreSQL is running and accessible.',
  );
  console.log(
    '   You can start PostgreSQL with: sudo service postgresql start',
  );
}

// Check Redis connection
console.log('\n🔍 Checking Redis connection...');
try {
  execSync('redis-cli ping', { stdio: 'pipe' });
  console.log('✅ Redis connection successful');
} catch (error) {
  console.log('⚠️  Redis connection failed. Make sure Redis is running.');
  console.log('   You can start Redis with: sudo service redis start');
}

// Setup database
console.log('\n🗄️  Setting up database...');
try {
  execSync('npm run db:create', { stdio: 'inherit' });
  execSync('npm run db:migrate', { stdio: 'inherit' });
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database setup completed');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('   Make sure PostgreSQL is running and accessible');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the service: npm run start:dev');
console.log('2. Access Swagger docs: http://localhost:3001/docs');
console.log('3. API endpoints: http://localhost:3001/api/v1');
console.log('4. Health check: http://localhost:3001/api/v1/health');
console.log('\n🔗 Test users:');
console.log('   - admin@relativitydevhub.com / admin123 (admin)');
console.log('   - user@relativitydevhub.com / user123 (user)');
console.log('   - reviewer@relativitydevhub.com / user123 (reviewer)');
console.log('\n🔧 Useful commands:');
console.log('   npm run start:dev     - Start development server');
console.log('   npm run build         - Build for production');
console.log('   npm test              - Run tests');
console.log('   npm run lint          - Run ESLint');
console.log('   npm run format        - Format code with Prettier');
