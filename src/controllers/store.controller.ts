import { Controller, Delete, Get, Post, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';
import { ViaCepService } from '../services/viacep.service';
import { GeocodingService } from '../services/geocoding.service';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService
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
  async getAllStores(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<{ stores: any[]; total: number }> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    const result = await this.storeService.findAll(parsedLimit, parsedOffset);
    return result;
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

  // Rota para deletar uma loja pelo ID
  @Delete(':id')
  async deleteStore(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.storeService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Rota para criar uma nova loja
  @Post()
  async createStore(@Body() body: { name: string; postalCode: string }): Promise<Store> {
    const { name, postalCode } = body;

    if (!name || !postalCode) {
      throw new NotFoundException('Nome e CEP são obrigatórios para criar uma loja.');
    }

    return this.storeService.create({ name, postalCode });
  }
}
