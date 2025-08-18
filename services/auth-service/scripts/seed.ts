import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_DATABASE || 'relativity_devhub',
  });

  try {
    await client.connect();
    console.log('Connected to database for seeding');

    // Hash password for admin user
    const saltRounds = 12;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('user123', saltRounds);

    // Check if admin user already exists
    const adminExists = await client.query(
      "SELECT id FROM users WHERE email = $1",
      ['admin@relativitydevhub.com']
    );

    if (adminExists.rows.length === 0) {
      // Insert admin user
      await client.query(`
        INSERT INTO users (email, first_name, last_name, password, role, status, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'admin@relativitydevhub.com',
        'Admin',
        'User',
        adminPassword,
        'admin',
        'active',
        true
      ]);
      console.log('Admin user created: admin@relativitydevhub.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Check if test user exists
    const testUserExists = await client.query(
      "SELECT id FROM users WHERE email = $1",
      ['user@relativitydevhub.com']
    );

    if (testUserExists.rows.length === 0) {
      // Insert test user
      await client.query(`
        INSERT INTO users (email, first_name, last_name, password, role, status, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'user@relativitydevhub.com',
        'Test',
        'User',
        userPassword,
        'user',
        'active',
        true
      ]);
      console.log('Test user created: user@relativitydevhub.com / user123');
    } else {
      console.log('Test user already exists');
    }

    // Check if reviewer user exists
    const reviewerExists = await client.query(
      "SELECT id FROM users WHERE email = $1",
      ['reviewer@relativitydevhub.com']
    );

    if (reviewerExists.rows.length === 0) {
      // Insert reviewer user
      await client.query(`
        INSERT INTO users (email, first_name, last_name, password, role, status, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'reviewer@relativitydevhub.com',
        'Reviewer',
        'User',
        userPassword,
        'reviewer',
        'active',
        true
      ]);
      console.log('Reviewer user created: reviewer@relativitydevhub.com / user123');
    } else {
      console.log('Reviewer user already exists');
    }

    console.log('Database seeding completed successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
