import { Module } from '@nestjs/common';
import { DatabaseConnection } from './db/conn';
import { StoreModule } from './modules/store.module';
import { AppLoggerService } from './utils/logger.service';

@Module({
  imports: [DatabaseConnection, StoreModule],
  providers: [AppLoggerService],
  exports: [AppLoggerService]
})
export class AppModule {}
