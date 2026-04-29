import { Module } from '@nestjs/common';
import { TenantWorker } from './tenant.worker';

@Module({
  providers: [TenantWorker],
})
export class WorkerModule {}
