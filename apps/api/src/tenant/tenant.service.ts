import { Inject, Injectable } from '@nestjs/common';
import { organizationMembers, organizations } from '@repo/database';
import { DATABASE_PUBLIC } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { QueueService } from '../database/queue.service';

@Injectable()
export class TenantService {
  constructor(
    @Inject(DATABASE_PUBLIC) private readonly publicDb: any,
    private readonly queueService: QueueService,
  ) {}

  async createTenant(name: string, subdomain: string, userId?: string) {
    // ... existing validation and public registry logic ...
    const existing = await this.publicDb
      .select()
      .from(organizations)
      .where(eq(organizations.subdomain, subdomain))
      .limit(1)
      .then((res: any[]) => res[0]);

    if (existing) {
      throw new Error('Subdomain already taken');
    }

    const schemaName = `tenant_${subdomain.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 2. Create in public registry
    const newOrg = await this.publicDb
      .insert(organizations)
      .values({
        name,
        subdomain,
        schemaName,
      })
      .returning()
      .then((res: any[]) => res[0]);

    // 2.5 Link user to org if provided
    if (userId) {
      await this.publicDb.insert(organizationMembers).values({
        organizationId: newOrg.id,
        userId: userId,
        role: 'OWNER',
      });
    }

    // 3. Dispatch background task for schema provisioning
    await this.queueService.sendToQueue('tenant_provisioning', { schemaName });

    return newOrg;
  }

  async getAllTenants() {
    return this.publicDb.select().from(organizations);
  }
}
