import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, OnModuleInit } from '@nestjs/common';
import { Store, StoreSchema } from '../database/models/store.model';
import { StoreController } from './store/controllers/store.controller';
import { StoreService } from './store/controllers/services/store.service';
import { ViaCepService } from './store/controllers/services/viacep.service';
import { ChangelogController } from '../common/swagger/changelog.controller';
import { CorreiosService } from './store/controllers/services/correios.service';
import { GeocodingService } from './store/controllers/services/geocoding.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]), HttpModule],
  controllers: [StoreController, ExternalApisController, StatusCodesController, ChangelogController],
  providers: [StoreService, ViaCepService, GeocodingService, CorreiosService]
})
export class StoreModule implements OnModuleInit {
  onModuleInit() {}
}
