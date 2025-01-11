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
    @Query('limit') limit: string = '1',
    @Query('offset') offset: string = '0'
  ): Promise<{ stores: StoreResponseDto[]; limit: number; offset: number; total: number }> {
    const parsedLimit = parseInt(limit, 10) || 1;
    const parsedOffset = parseInt(offset, 10) || 0;

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
  async storeByCep(
    @Query('cep') cep: string,
    @Query('limit') limit: string = '1',
    @Query('offset') offset: string = '0'
  ): Promise<{ stores: any[]; pins: any[]; limit: number; offset: number; total: number }> {
    const parsedLimit = parseInt(limit, 10) || 1;
    const parsedOffset = parseInt(offset, 10) || 0;

    const result = await this.storeService.getStoresByCep(cep, parsedLimit, parsedOffset);
    return {
      stores: result.nearbyStores,
      pins: result.pins,
      limit: parsedLimit,
      offset: parsedOffset,
      total: result.total
    };
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
  async getStoresByState(
    @Param('state') state: string,
    @Query('limit') limit: string = '1',
    @Query('offset') offset: string = '0'
  ): Promise<{ stores: Store[]; limit: number; offset: number; total: number }> {
    const parsedLimit = parseInt(limit, 10) || 1;
    const parsedOffset = parseInt(offset, 10) || 0;

    const { stores, total } = await this.storeService.findByState(state, parsedLimit, parsedOffset);
    return {
      stores,
      limit: parsedLimit,
      offset: parsedOffset,
      total
    };
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
