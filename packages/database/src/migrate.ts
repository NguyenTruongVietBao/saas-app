import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

// Only run if called directly (optional, but safer)
if (require.main === module) {
  main();
}

export async function migrateTenant(schemaName: string) {
  console.log(`[Migrator] Migrating tenant: ${schemaName}`);
  await db.execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await db.execute(`SET search_path TO "${schemaName}"`);
  const migrationsPath = path.join(process.cwd(), 'packages/database/drizzle');
  await migrate(db, { migrationsFolder: migrationsPath });
  await db.execute(`SET search_path TO public`);
}
