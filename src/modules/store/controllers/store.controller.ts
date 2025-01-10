import { Controller, Delete, Post, Get, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { StoreService } from './services/store.service';
import { Store } from '../../../database/models/store.model';
import { ViaCepService } from './services/viacep.service';
import { GeocodingService } from './services/geocoding.service';
import { CreateStoreDto } from '../../../common/dto/create-store.dto';
import { StoreResponseDto } from '../../../common/dto/store-response.dto';
import { plainToInstance } from 'class-transformer';
import { CorreiosService } from './services/correios.service';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
    private readonly correiosService: CorreiosService
  ) {
    console.log('StoreController carregado com sucesso!');
  }

  // Rota para listar todas as lojas
  @Get()
  async getAllStores(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<{ stores: StoreResponseDto[]; limit: number; offset: number; total: number }> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    const { stores, total } = await this.storeService.findAll(parsedLimit, parsedOffset);
    const formattedStores = plainToInstance(StoreResponseDto, stores, { excludeExtraneousValues: true });

    return {
      stores: formattedStores,
      limit: parsedLimit,
      offset: parsedOffset,
      total
    };
  }

  @Get('testCorreios')
  async testCorreios() {
    try {
      const frete = await this.correiosService.calcularFrete('51130705', '91349900');
      console.log('Resposta do teste da API dos Correios:', frete);
      return frete;
    } catch (error) {
      console.error('Erro ao testar API dos Correios:', error.message);
      return { error: 'Erro ao testar API dos Correios.' };
    }
  }

  // Rota para buscar lojas por CEP
  @Get('storeByCep')
  async storeByCep(@Query('cep') cep: string) {
    console.log('CEP recebido:', cep);
    return await this.storeService.getStoresByCep(cep);
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

  // Rota para buscar lojas por estado
  @Get('state/:state')
  async getStoresByState(@Param('state') state: string): Promise<{ stores: Store[]; total: number }> {
    try {
      return await this.storeService.findByState(state);
    } catch (error) {
      console.error('Erro ao buscar lojas por estado:', error.message);
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
