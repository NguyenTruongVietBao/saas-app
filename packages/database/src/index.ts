import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const queryClient = postgres(process.env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export type Database = typeof db;
export * from './db/schema';
export { migrateTenant } from './migrate';
export { schema };
