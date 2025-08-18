const crypto = require('crypto');

console.log('🔐 Generating secure JWT secrets for production...\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log('📋 Copy these values to your Vercel Environment Variables:\n');

console.log('JWT_SECRET=' + jwtSecret);
console.log('JWT_REFRESH_SECRET=' + jwtRefreshSecret);

console.log('\n⚠️  IMPORTANT:');
console.log('- Save these secrets securely');
console.log('- Never commit them to version control');
console.log('- Use different secrets for each environment');
console.log('- Rotate these secrets regularly in production');
