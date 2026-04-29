import postgres from 'postgres';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(__dirname, '../../.env') });

async function initDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not defined');
    process.exit(1);
  }

  try {
    const url = new URL(databaseUrl);
    const targetDb = url.pathname.slice(1);
    
    // Create a connection to the 'postgres' default database to check/create the target database
    url.pathname = '/postgres';
    const connectionString = url.toString();

    console.log(`\n  \x1b[36m🔍 Checking if database "${targetDb}" exists...\x1b[0m`);

    const sql = postgres(connectionString, { max: 1 });

    const databases = await sql`
      SELECT datname FROM pg_database WHERE datname = ${targetDb}
    `;

    if (databases.length === 0) {
      console.log(`  \x1b[33m⚠️  Database "${targetDb}" not found. Creating...\x1b[0m`);
      
      // We can't use parameterized queries for CREATE DATABASE
      await sql.unsafe(`CREATE DATABASE "${targetDb}"`);
      
      console.log(`  \x1b[32m✅ Database "${targetDb}" created successfully!\x1b[0m`);
    } else {
      console.log(`  \x1b[32m✅ Database "${targetDb}" already exists.\x1b[0m`);
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('\n  \x1b[31m❌ Error initializing database:\x1b[0m');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

initDb();
