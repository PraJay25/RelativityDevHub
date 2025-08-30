console.log('🧪 Final Vercel deployment test...');

try {
  // Test the compiled handler
  const handler = require('./dist/api/index').default;
  console.log('✅ Handler function imported successfully');
  console.log('Type:', typeof handler);

  // Test that it's a function
  if (typeof handler === 'function') {
    console.log('✅ Handler is a valid function');
  } else {
    throw new Error('Handler is not a function');
  }

  console.log('🎉 Vercel deployment is ready!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Deploy to Vercel: vercel --prod');
  console.log(
    '2. Test health endpoint: https://your-domain.vercel.app/api/v1/health',
  );
  console.log(
    '3. Test auth endpoints: https://your-domain.vercel.app/api/v1/auth/login',
  );
  console.log('');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
