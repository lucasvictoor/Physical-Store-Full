import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';
import { ViaCepService } from '../services/viacep.service';
import { GeocodingService } from '../services/geocoding.service';

@Controller('stores') // Define o prefixo para as rotas (ex.: /api/stores)
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
  ) {}

  // Testar ViaCepService
  @Get('test-cep')
  async testViaCep(@Query('cep') cep: string) {
    if (!cep) {
      throw new NotFoundException('CEP não fornecido.');
    }

    const address = await this.viaCepService.getAddress(cep);
    return { address };
  }

  // Testar GeocodingService
  @Get('test-geocode')
  async testGeocoding(@Query('address') address: string) {
    if (!address) {
      throw new NotFoundException('Endereço não fornecido.');
    }

    const coordinates = await this.geocodingService.getCoordinates(address);
    return { coordinates };
  }

  // Rota para listar todas as lojas
  @Get()
  async getAllStores(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  // Rota para buscar uma loja pelo ID
  @Get(':id')
  async getStoreById(@Param('id') id: string): Promise<Store> {
    const store = await this.storeService.findById(id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  // Rota para criar uma nova loja
  @Post()
  async createStore(@Body() storeData: Partial<Store>): Promise<Store> {
    return this.storeService.create(storeData);
  }
}
