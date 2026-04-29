import { Global, Module } from '@nestjs/common';
import { QUEUE_CONNECTION } from '@repo/shared';
import * as amqp from 'amqp-connection-manager';
import { QueueService } from './queue.service';

@Global()
@Module({
  providers: [
    {
      provide: QUEUE_CONNECTION,
      useFactory: () => {
        return amqp.connect([
          process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        ]);
      },
    },
    QueueService,
  ],
  exports: [QUEUE_CONNECTION, QueueService],
})
export class QueueModule {}
