import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { StoreController } from '../controllers/store.controller';
import { StoreService } from '../services/store.service';
import { Store, StoreSchema } from '../models/store.model';
import { ViaCepService } from '../services/viacep.service';
import { GeocodingService } from '../services/geocoding.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    HttpModule, // Importa o HttpModule para usar chamadas HTTP
  ],
  controllers: [StoreController],
  providers: [StoreService, ViaCepService, GeocodingService],
})
export class StoreModule {}
