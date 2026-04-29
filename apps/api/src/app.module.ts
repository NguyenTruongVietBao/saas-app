import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './database/queue.module';
import { RedisModule } from './database/redis.module';
import { TenantModule } from './tenant/tenant.module';
import { TodoModule } from './todo/todo.module';
import { WorkerModule } from './worker/worker.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    RedisModule,
    QueueModule,
    WorkerModule,
    TenantModule,
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantResolverMiddleware).forRoutes('*');
  }
}
