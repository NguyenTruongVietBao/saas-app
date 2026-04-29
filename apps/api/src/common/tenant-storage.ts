import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
  schemaName: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();
