import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';

@Controller('stores') // Define o prefixo para as rotas (ex.: /api/stores)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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
