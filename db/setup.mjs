// Applies db/schema.sql to your Neon database.
//
// Usage:
//   NEON_DATABASE_URL="postgres://..." node db/setup.mjs
//
// Or with an .env file at the project root containing NEON_DATABASE_URL:
//   node --env-file-if-exists=.env db/setup.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Pool } from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('Missing NEON_DATABASE_URL (or DATABASE_URL) environment variable.');
  process.exit(1);
}

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(schema);
  console.log('Schema applied successfully: challenges + submissions tables are ready.');
} catch (error) {
  console.error('Failed to apply schema:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
