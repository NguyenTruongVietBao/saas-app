import { sql } from 'drizzle-orm';
import { db } from '..';

async function checkConnection() {
  const start = Date.now();

  console.log('\n  \x1b[36m🚀 Starting database connection check...\x1b[0m');

  try {
    // Perform a simple query to verify connection
    await db.execute(sql`SELECT 1`);

    const duration = Date.now() - start;

    console.log(
      '\n  \x1b[32m┌───────────────────────────────────────────────────┐\x1b[0m',
    );
    console.log(
      '  \x1b[32m│                                                   │\x1b[0m',
    );
    console.log(
      '  \x1b[32m│   ✨ DATABASE CONNECTION SUCCESSFUL!              │\x1b[0m',
    );
    console.log(
      `  \x1b[32m│   ⏱️  Latency: ${duration}ms                             │\x1b[0m`,
    );
    console.log(
      '  \x1b[32m│   📌 Driver: postgres.js (Standard PostgreSQL)    │\x1b[0m',
    );
    console.log(
      '  \x1b[32m│                                                   │\x1b[0m',
    );
    console.log(
      '  \x1b[32m└───────────────────────────────────────────────────┘\x1b[0m\n',
    );

    process.exit(0);
  } catch (error) {
    console.error(
      '\n  \x1b[31m┌───────────────────────────────────────────────────┐\x1b[0m',
    );
    console.error(
      '  \x1b[31m│                                                   │\x1b[0m',
    );
    console.error(
      '  \x1b[31m│   ❌ DATABASE CONNECTION FAILED!                  │\x1b[0m',
    );
    console.error(
      '  \x1b[31m│                                                   │\x1b[0m',
    );
    console.error(
      '  \x1b[31m└───────────────────────────────────────────────────┘\x1b[0m',
    );
    console.error(
      `\n  \x1b[33mError Detail:\x1b[0m`,
      error instanceof Error ? error.message : error,
    );
    console.log('\n');

    process.exit(1);
  }
}

checkConnection();
