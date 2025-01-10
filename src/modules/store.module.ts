import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { StoreController } from './store/controllers/store.controller';
import { StoreService } from './store/controllers/services/store.service';
import { Store, StoreSchema } from '../database/models/store.model';
import { ViaCepService } from './store/controllers/services/viacep.service';
import { GeocodingService } from './store/controllers/services/geocoding.service';
import { CorreiosService } from './store/controllers/services/correios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]), HttpModule],
  controllers: [StoreController],
  providers: [StoreService, ViaCepService, GeocodingService, CorreiosService]
})
export class StoreModule implements OnModuleInit {
  onModuleInit() {}
}
