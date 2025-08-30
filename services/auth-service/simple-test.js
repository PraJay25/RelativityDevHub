console.log('🧪 Simple test...');

try {
  // Test basic import
  const bootstrap = require('./dist/src/main.vercel').default;
  console.log('✅ Bootstrap function imported successfully');
  console.log('Type:', typeof bootstrap);
  
  // Test handler import
  const handler = require('./dist/api/index').default;
  console.log('✅ Handler function imported successfully');
  console.log('Type:', typeof handler);
  
  console.log('🎉 Basic imports work!');
  
} catch (error) {
  console.error('❌ Import failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
