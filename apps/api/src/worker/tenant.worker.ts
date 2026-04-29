import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { migrateTenant } from '@repo/database';
import { QUEUE_CONNECTION } from '@repo/shared';
import type { AmqpConnectionManager } from 'amqp-connection-manager';

@Injectable()
export class TenantWorker implements OnModuleInit {
  constructor(
    @Inject(QUEUE_CONNECTION)
    private readonly connection: AmqpConnectionManager,
  ) {}

  onModuleInit() {
    const channel = this.connection.createChannel({
      json: true,
      setup: (channel: any) => {
        return Promise.all([
          channel.assertQueue('tenant_provisioning', { durable: true }),
          channel.consume('tenant_provisioning', (msg: any) =>
            this.processProvisioning(msg),
          ),
        ]);
      },
    });
  }

  private async processProvisioning(msg: any) {
    if (!msg) return;
    const { schemaName } = JSON.parse(msg.content.toString());

    console.log(`[Worker] Provisioning schema: ${schemaName}`);

    try {
      await migrateTenant(schemaName);
      console.log(`[Worker] Successfully provisioned schema: ${schemaName}`);
    } catch (error) {
      console.error(
        `[Worker] Failed to provision schema: ${schemaName}`,
        error,
      );
      // Logic for retry/DLQ would go here
    }
  }
}
