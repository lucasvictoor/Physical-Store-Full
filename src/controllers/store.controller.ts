import { Controller, Delete, Post, Get, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';
import { ViaCepService } from '../services/viacep.service';
import { GeocodingService } from '../services/geocoding.service';
import { CreateStoreDto } from '../dto/create-store.dto';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService
  ) {
    console.log('StoreController carregado com sucesso!');
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

  // Rota para buscar loja por CEP
  @Get('cep/:cep')
  async getStoresByCep(@Param('cep') cep: string): Promise<any[]> {
    console.log('Rota /stores/cep/:cep acessada com o CEP:', cep);
    try {
      const result = await this.storeService.findByCep(cep);
      console.log('Resultado retornado:', result);
      return result;
    } catch (error) {
      console.error('Erro no método getStoresByCep:', error.message);
      throw new NotFoundException(error.message);
    }
  }

  // Rota para buscar uma loja pelo ID
  @Get(':id')
  async getStoreById(@Param('id') id: string): Promise<Store> {
    try {
      return await this.storeService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
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
  async createStore(@Body() body: CreateStoreDto): Promise<Store> {
    return this.storeService.create(body);
  }
}
