import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createTables() {
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

  const client = connectionString
    ? new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      })
    : new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin123',
        database: process.env.DB_DATABASE || 'relativity_devhub',
      });

  try {
    await client.connect();
    console.log('Connected to database');

    // Ensure required extensions for UUID generation exist (Supabase-friendly)
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    } catch (e) {
      console.warn(
        'Could not ensure pgcrypto extension:',
        (e as Error).message,
      );
    }
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    } catch (e) {
      console.warn(
        'Could not ensure uuid-ossp extension:',
        (e as Error).message,
      );
    }

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'reviewer')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        email_verified BOOLEAN DEFAULT FALSE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger for users table
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Tables and indexes created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
createTables()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
