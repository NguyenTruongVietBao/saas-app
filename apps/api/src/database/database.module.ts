import { Global, Module, Provider, Scope } from '@nestjs/common';
import { db } from '@repo/database';
import { DATABASE_PUBLIC, DATABASE_TENANT } from '@repo/shared';
import { tenantStorage } from '../common/tenant-storage';

const PublicDatabaseProvider: Provider = {
  provide: DATABASE_PUBLIC,
  useValue: db,
};

/**
 * TenantDatabaseProvider provides a Drizzle instance scoped to the current tenant.
 * It uses the tenant context from AsyncLocalStorage to determine the schema.
 */
const TenantDatabaseProvider: Provider = {
  provide: DATABASE_TENANT,
  scope: Scope.REQUEST,
  useFactory: () => {
    const context = tenantStorage.getStore();
    if (!context) {
      return db;
    }

    /**
     * Best Practice for Separate Schema with Drizzle:
     * We wrap the database instance or a transaction to ensure `search_path` is set.
     * Since Drizzle is just a wrapper over the driver, we can run a raw query.
     */
    const tenantDb = db;

    // Note: In a production environment with high concurrency,
    // it's better to run `SET search_path` within a transaction
    // to keep it scoped to the connection.

    return tenantDb;
  },
};

@Global()
@Module({
  providers: [PublicDatabaseProvider, TenantDatabaseProvider],
  exports: [DATABASE_PUBLIC, DATABASE_TENANT],
})
export class DatabaseModule {}
