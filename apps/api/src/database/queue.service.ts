import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { QUEUE_CONNECTION } from '@repo/shared';
import type { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class QueueService implements OnModuleInit {
  private channelWrapper!: ChannelWrapper;

  constructor(
    @Inject(QUEUE_CONNECTION)
    private readonly connection: AmqpConnectionManager,
  ) {}

  onModuleInit() {
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: any) => {
        return Promise.all([
          channel.assertQueue('tenant_provisioning', { durable: true }),
        ]);
      },
    });
  }

  async sendToQueue(queue: string, data: any) {
    await this.channelWrapper.sendToQueue(queue, data);
  }
}
