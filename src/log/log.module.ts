import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LoggerMiddleware } from './log.middleware';
import { LogService } from './log.service';
import { AllExceptionsFilter } from './exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LoggerMiddleware, LogService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class LogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
} { }
