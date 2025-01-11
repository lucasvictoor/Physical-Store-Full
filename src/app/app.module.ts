import { Module } from '@nestjs/common';
import { StoreModule } from '../modules/store.module';
import { LoggerService } from '../common/utils/logger';
import { DatabaseConnection } from '../database/models/conn';

@Module({
  imports: [DatabaseConnection, StoreModule],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class AppModule {}
