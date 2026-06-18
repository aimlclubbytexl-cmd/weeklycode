import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const DB_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ Error: NEON_DATABASE_URL or DATABASE_URL is not set');
  console.error('   Set it in .env file or export it as an environment variable');
  process.exit(1);
}

const pool = new Pool({ connectionString: DB_URL });

async function migrate() {
  try {
    console.log('🔄 Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        role VARCHAR(50) DEFAULT 'student',
        avatar TEXT,
        badges TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    console.log('🔄 Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      `INSERT INTO users (id, username, email, password, university, points, streak, role, avatar, badges)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO NOTHING`,
      [
        'admin-user',
        'Admin',
        'admin@platform.com',
        hashedPassword,
        'Platform Admin',
        0,
        0,
        'admin',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        JSON.stringify([]),
      ]
    );
    console.log('✅ Admin user created (email: admin@platform.com, password: admin123)');

    console.log('🔄 Creating sample student user...');
    const studentPassword = await bcrypt.hash('password', 10);
    
    await pool.query(
      `INSERT INTO users (id, username, email, password, university, points, streak, role, avatar, badges)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO NOTHING`,
      [
        'u1',
        'alexcode',
        'alex@university.edu',
        studentPassword,
        'Tech University',
        1250,
        5,
        'student',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        JSON.stringify(['first-blood', 'consistency', 'polyglot', 'bug-hunter']),
      ]
    );
    console.log('✅ Sample student user created (email: alex@university.edu, password: password)');

    console.log('🔄 Creating challenges table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id VARCHAR(50) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        constraints JSONB DEFAULT '[]',
        sample_input TEXT DEFAULT '',
        sample_output TEXT DEFAULT '',
        deadline TIMESTAMP NOT NULL,
        points INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Challenges table created');

    console.log('🔄 Creating submissions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(50) PRIMARY KEY,
        challenge_id VARCHAR(50) REFERENCES challenges(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        github_link TEXT NOT NULL,
        submitted_at TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL,
        score INTEGER DEFAULT 0,
        remarks TEXT DEFAULT '',
        language VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Submissions table created');

    console.log('🔄 Inserting a sample challenge...');
    await pool.query(
      `INSERT INTO challenges (id, title, description, constraints, sample_input, sample_output, deadline, points, status, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        'c1',
        'Reverse Linked List',
        'Reverse a singly linked list and return the head of the reversed list.',
        JSON.stringify(['Time complexity O(n)', 'Space complexity O(1)']),
        '1 -> 2 -> 3 -> NULL',
        '3 -> 2 -> 1 -> NULL',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        250,
        'active',
        'Linked Lists',
      ]
    );
    console.log('✅ Sample challenge inserted');

    console.log('🔄 Inserting a sample submission...');
    await pool.query(
      `INSERT INTO submissions (id, challenge_id, user_id, github_link, submitted_at, status, score, remarks, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        's1',
        'c1',
        'u1',
        'https://github.com/alexcode/reversed-list',
        new Date().toISOString(),
        'pending',
        0,
        '',
        'JavaScript',
      ]
    );
    console.log('✅ Sample submission inserted');

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📋 Test users:');
    console.log('  Admin: admin@platform.com / admin123');
    console.log('  Student: alex@university.edu / password');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
