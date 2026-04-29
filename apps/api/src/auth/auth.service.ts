import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { organizationMembers, organizations, users } from '@repo/database';
import { DATABASE_PUBLIC, REDIS_CLIENT } from '@repo/shared';
import { slugify } from '@repo/utils';
import * as bcrypt from 'bcrypt';
import { and, eq, sql } from 'drizzle-orm';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto, UserRoleType } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_PUBLIC) private readonly publicDb: any,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.publicDb
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1)
      .then((res: any[]) => res[0]);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (dto.role === UserRoleType.MANAGER && !dto.organizationName) {
      throw new BadRequestException(
        'Organization name is required for manager role',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return await this.publicDb.transaction(async (tx: any) => {
      // 1. Create User
      const [newUser] = await tx
        .insert(users)
        .values({
          fullName: dto.fullName,
          email: dto.email,
          passwordHash,
        })
        .returning();

      let organization: typeof organizations.$inferSelect | null = null;

      // 2. If Manager, Create Organization and Schema
      if (dto.role === UserRoleType.MANAGER && dto.organizationName) {
        const subdomain = slugify(dto.organizationName);
        const schemaName = `tenant_${subdomain.replace(/-/g, '_')}`;

        [organization] = await tx
          .insert(organizations)
          .values({
            name: dto.organizationName,
            subdomain,
            schemaName,
            plan: 'free',
            status: 'active',
          })
          .returning();

        // 3. Create Membership (OWNER)
        await tx.insert(organizationMembers).values({
          organizationId: organization?.id,
          userId: newUser.id,
          role: 'OWNER',
        });

        // 4. Initialize physical Schema
        // Note: Logic for running migrations within this schema should be handled separately
        await tx.execute(
          sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`),
        );
      }

      const { passwordHash: _, ...userResult } = newUser;

      // Auto-login after signup
      const { access_token, refresh_token } = await this.login(userResult);

      return {
        user: userResult,
        organization,
        access_token,
        refresh_token,
      };
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.publicDb
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res: any[]) => res[0]);

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'initial',
    };

    // Fetch organizations user belongs to
    const userOrgs = await this.publicDb
      .select({
        id: organizations.id,
        name: organizations.name,
        subdomain: organizations.subdomain,
        role: organizationMembers.role,
      })
      .from(organizations)
      .innerJoin(
        organizationMembers,
        eq(organizations.id, organizationMembers.organizationId),
      )
      .where(eq(organizationMembers.userId, user.id));

    const refreshToken = uuidv4();
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user,
      organizations: userOrgs,
    };
  }

  async selectOrg(userId: string, orgId: string) {
    const membership = await this.publicDb
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, orgId),
        ),
      )
      .limit(1)
      .then((res: any[]) => res[0]);

    if (!membership) {
      throw new UnauthorizedException(
        'User does not belong to this organization',
      );
    }

    const org = await this.publicDb
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1)
      .then((res: any[]) => res[0]);

    const payload = {
      sub: userId,
      orgId: orgId,
      schemaName: org.schemaName,
      role: membership.role,
      type: 'contextual',
    };

    return {
      access_token: this.jwtService.sign(payload),
      organization: org,
    };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
    const key = `auth:rt:${token}`;

    await this.redis.set(key, JSON.stringify({ userId }), 'EX', ttl);
  }

  async refreshToken(token: string) {
    const key = `auth:rt:${token}`;
    const data = await this.redis.get(key);

    if (!data) {
      // Replay attack detection: If token is not in Redis, it might be reused or revoked
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const { userId } = JSON.parse(data);

    // Rotate token: Delete the old one
    await this.redis.del(key);

    const user = await this.publicDb
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((res: any[]) => res[0]);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }

  async logout(token: string) {
    const key = `auth:rt:${token}`;
    await this.redis.del(key);
  }
}
