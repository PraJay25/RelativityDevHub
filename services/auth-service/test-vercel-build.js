const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Vercel build process...');

try {
  // Check if TypeScript compiles
  console.log('📦 Running TypeScript compilation...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if dist files exist
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('dist directory not found after build');
  }

  // Check if main files exist
  const requiredFiles = [
    'main.js',
    'main.vercel.js',
    'app.module.js',
    'api/index.js',
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file not found: ${file}`);
    }
  }

  console.log('✅ Build test passed! All required files generated.');
  console.log('🚀 Ready for Vercel deployment.');
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}
