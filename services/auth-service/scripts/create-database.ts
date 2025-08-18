import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createDatabase() {
  // Prefer cloud connection strings when provided
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

  const client = connectionString
    ? new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        database: 'postgres',
      })
    : new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin123',
        database: 'postgres',
      });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_DATABASE || 'relativity_devhub'],
    );

    if (result.rows.length === 0) {
      // Create database
      await client.query(
        `CREATE DATABASE "${process.env.DB_DATABASE || 'relativity_devhub'}"`,
      );
      console.log(
        `Database '${process.env.DB_DATABASE || 'relativity_devhub'}' created successfully`,
      );
    } else {
      console.log(
        `Database '${process.env.DB_DATABASE || 'relativity_devhub'}' already exists`,
      );
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the script
createDatabase()
  .then(() => {
    console.log('Database setup completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
