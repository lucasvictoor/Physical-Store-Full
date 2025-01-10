import { Module } from '@nestjs/common';
import { DatabaseConnection } from '../database/conn';
import { StoreModule } from '../modules/store.module';
import { LoggerService } from '../common/utils/logger';

@Module({
  imports: [DatabaseConnection, StoreModule],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class AppModule {}
