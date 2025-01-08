import { Module } from '@nestjs/common';
import { DatabaseConnection } from '../database/conn';
import { StoreModule } from '../modules/store.module';
import { AppLoggerService } from '../common/utils/logger.service';

@Module({
  imports: [DatabaseConnection, StoreModule],
  providers: [AppLoggerService],
  exports: [AppLoggerService]
})
export class AppModule {}
