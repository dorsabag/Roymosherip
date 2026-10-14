import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const migrationsFolder = fileURLToPath(new URL('./drizzle/', import.meta.url));
const journal = JSON.parse(readFileSync(`${migrationsFolder}/meta/_journal.json`, 'utf8'));
if (!journal.entries.length) throw new Error('Expected checked-in migrations');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await migrate(drizzle(pool), { migrationsFolder });
  console.log('Checked-in database migrations applied successfully');
} finally {
  await pool.end();
}
