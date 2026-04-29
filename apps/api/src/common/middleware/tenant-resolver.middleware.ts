import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { organizations } from '@repo/database';
import { DATABASE_PUBLIC, REDIS_CLIENT } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { tenantStorage } from '../tenant-storage';

import Redis from 'ioredis';

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(
    @Inject(DATABASE_PUBLIC) private readonly publicDb: any,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 1. Try to resolve from JWT first (Explicit context)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: any = jwt.decode(token);
        if (decoded && decoded.schemaName) {
          return tenantStorage.run(
            { tenantId: decoded.orgId, schemaName: decoded.schemaName },
            () => next(),
          );
        }
      } catch (err) {
        // Fallback to subdomain if decoding fails
      }
    }

    // 2. Resolve from subdomain (Implicit context)
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    // Skip resolution for main infrastructure domain
    if (['localhost', 'www', 'app', 'nguyen-saas'].includes(subdomain)) {
      return next();
    }

    try {
      // 2.1 Check Cache
      const cacheKey = `org:${subdomain}`;
      const cachedOrg = await this.redis.get(cacheKey);

      let org;
      if (cachedOrg) {
        org = JSON.parse(cachedOrg);
      } else {
        // Query organization from public schema
        org = await this.publicDb
          .select()
          .from(organizations)
          .where(eq(organizations.subdomain, subdomain))
          .limit(1)
          .then((res: any[]) => res[0]);

        if (org) {
          // Cache for 1 hour
          await this.redis.set(cacheKey, JSON.stringify(org), 'EX', 3600);
        }
      }

      if (!org) {
        return res.status(404).json({ message: 'Organization not found' });
      }

      // 3. Run the rest of the request within the tenant context
      tenantStorage.run({ tenantId: org.id, schemaName: org.schemaName }, () =>
        next(),
      );
    } catch (error) {
      console.error('Tenant resolution error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error during tenant resolution' });
    }
  }
}
