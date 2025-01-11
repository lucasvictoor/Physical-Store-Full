import { plainToInstance } from 'class-transformer';
import { StoreService } from './services/store.service';
import { ViaCepService } from './services/viacep.service';
import { Store } from '../../../database/models/store.model';
import { CorreiosService } from './services/correios.service';
import { GeocodingService } from './services/geocoding.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStoreDto } from '../../../common/dto/create-store.dto';
import { StoreResponseDto } from '../../../common/dto/store-response.dto';
import { Controller, Delete, Post, Get, Body, Patch, Param, NotFoundException, Query } from '@nestjs/common';
import {
  createStoreSchema,
  editStoreSchema,
  listStoresSchema,
  deleteStoreSchema,
  getStoreByIdSchema,
  getStoresByStateSchema,
  getStoresByCepSchema
} from '../../../common/swagger/store-schemas';
@ApiTags('Endpoints das Lojas')
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
    private readonly correiosService: CorreiosService
  ) {}

  // Rota para listar todas as lojas
  @Get()
  @ApiResponse(listStoresSchema)
  async getAllStores(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<{ stores: StoreResponseDto[]; limit: number; offset: number; total: number }> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 3;

    const { stores, total } = await this.storeService.findAll(parsedLimit, parsedOffset);
    const formattedStores = plainToInstance(StoreResponseDto, stores, { excludeExtraneousValues: true });

    return {
      stores: formattedStores,
      limit: parsedLimit,
      offset: parsedOffset,
      total
    };
  }

  // Rota para buscar lojas por CEP
  @Get('storeByCep')
  @ApiResponse(getStoresByCepSchema)
  async storeByCep(@Query('cep') cep: string) {
    console.log('CEP recebido:', cep);
    return await this.storeService.getStoresByCep(cep);
  }

  // Rota para buscar uma loja pelo ID
  @Get(':id')
  @ApiResponse(getStoreByIdSchema)
  async getStoreById(@Param('id') id: string): Promise<Store> {
    try {
      return await this.storeService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Rota para buscar lojas por estado
  @Get('state/:state')
  @ApiResponse(getStoresByStateSchema)
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
  @ApiResponse(deleteStoreSchema)
  async deleteStore(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.storeService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Rota para editar uma loja pelo ID
  @Patch(':id')
  @ApiBody(editStoreSchema.body)
  @ApiResponse(editStoreSchema.response)
  async updateStore(@Param('id') id: string, @Body() updateData: Partial<Store>): Promise<Store> {
    try {
      return await this.storeService.updateStore(id, updateData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Rota para criar uma nova loja
  @Post()
  @ApiBody(createStoreSchema.body)
  @ApiResponse(createStoreSchema.response)
  async createStore(@Body() body: CreateStoreDto): Promise<Store> {
    return this.storeService.create(body);
  }
}
