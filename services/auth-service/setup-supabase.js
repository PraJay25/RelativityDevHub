const { Client } = require('pg');

async function setupSupabase() {
  console.log('🔧 Setting up Supabase connection...\n');

  // Your Supabase project details
  const projectRef = 'ldfwqpebweomryodurha';
  const apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZndxcGVid2VvbXJ5b2R1cmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTY5MTcsImV4cCI6MjA3MTA3MjkxN30.Ka5V7BQ2XbspG8S0ugGijHoFzr_AuQ6LYqgAMJkhLCE';

  console.log('📋 Your Supabase Project Details:');
  console.log(`Project URL: https://${projectRef}.supabase.co`);
  console.log(`API Key: ${apiKey}`);
  console.log('');

  // You need to provide your database password
  console.log('⚠️  IMPORTANT: You need to provide your database password');
  console.log('   Go to your Supabase Dashboard → Settings → Database');
  console.log(
    '   Copy the connection string and replace [YOUR-PASSWORD] with your actual password',
  );
  console.log('');
  console.log('   Connection string format:');
  console.log(
    `   postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`,
  );
  console.log('');
  console.log('🔗 Vercel Environment Variables to set:');
  console.log('');
  console.log(
    'DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ldfwqpebweomryodurha.supabase.co:5432/postgres',
  );
  console.log(
    'JWT_SECRET=19860e442fe9a6344dcc8401177d64d078b1348a7ed4d68f0b492205d9a6127b',
  );
  console.log(
    'JWT_REFRESH_SECRET=a21d30b36a3399238d3726ba20c38151a7d4523cd692454b095750aee8b0a0a9',
  );
  console.log('NODE_ENV=production');
  console.log('CORS_ORIGIN=https://your-frontend-domain.vercel.app');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Get your database password from Supabase Dashboard');
  console.log('2. Deploy to Vercel with these environment variables');
  console.log('3. Test the database connection');
}

setupSupabase();

$env: DATABASE_URL =
  'postgresql://postgres:251292@Japan@db.ldfwqpebweomryodurha.supabase.co:5432/postgres';