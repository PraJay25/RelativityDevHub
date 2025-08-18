const { Client } = require('pg');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Replace this with your actual Supabase connection string
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres';
  
  if (connectionString.includes('[YOUR-PASSWORD]')) {
    console.log('❌ Please update the DATABASE_URL with your actual Supabase connection string');
    console.log('📝 Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
    return;
  }
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Database time:', result.rows[0].current_time);
    
    // Check if users table exists
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableResult.rows[0].exists) {
      console.log('✅ Users table already exists');
    } else {
      console.log('ℹ️  Users table does not exist yet (will be created by migrations)');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your connection string format');
    console.log('2. Verify your database password');
    console.log('3. Ensure your IP is allowed in Supabase settings');
    console.log('4. Check if the database is accessible');
  } finally {
    await client.end();
  }
}

// Run the test
testDatabaseConnection();
