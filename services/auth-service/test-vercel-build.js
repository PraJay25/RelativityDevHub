const path = require('path');

console.log('🧪 Testing Vercel build...');

try {
  // Test if the main.vercel.js file exists and can be required
  const mainVercelPath = path.join(__dirname, 'dist', 'src', 'main.vercel.js');
  console.log('📁 Checking main.vercel.js at:', mainVercelPath);

  const fs = require('fs');
  if (fs.existsSync(mainVercelPath)) {
    console.log('✅ main.vercel.js exists');

    // Try to require it
    const bootstrap = require(mainVercelPath).default;
    if (typeof bootstrap === 'function') {
      console.log('✅ bootstrap function is available');
    } else {
      console.log('❌ bootstrap function is not available');
      process.exit(1);
    }
  } else {
    console.log('❌ main.vercel.js does not exist');
    process.exit(1);
  }

  // Test if the api/index.js file exists
  const apiIndexPath = path.join(__dirname, 'dist', 'api', 'index.js');
  console.log('📁 Checking api/index.js at:', apiIndexPath);

  if (fs.existsSync(apiIndexPath)) {
    console.log('✅ api/index.js exists');

    // Try to require it
    const handler = require(apiIndexPath).default;
    if (typeof handler === 'function') {
      console.log('✅ handler function is available');
    } else {
      console.log('❌ handler function is not available');
      process.exit(1);
    }
  } else {
    console.log('❌ api/index.js does not exist');
    process.exit(1);
  }

  console.log('🎉 All tests passed! Vercel build is ready.');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
