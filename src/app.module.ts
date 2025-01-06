import { Module } from '@nestjs/common';
import { DatabaseConnection } from './db/conn';
import { StoreModule } from './modules/store.module';

@Module({
  imports: [DatabaseConnection, StoreModule],
})
export class AppModule {}
