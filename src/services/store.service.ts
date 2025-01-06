import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../models/store.model';
import { ViaCepService } from './viacep.service';
import { GeocodingService } from './geocoding.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findById(id: string): Promise<Store | null> {
    return this.storeModel.findById(id).exec();
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.storeModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }

    return { message: `Loja com o ID ${id} foi deletada com sucesso.` };
  }

  async create(storeData: {
    name: string;
    postalCode: string;
  }): Promise<Store> {
    const { name, postalCode } = storeData;

    // Remove caracteres desnecessários do CEP
    const formattedCep = postalCode.replace(/[^0-9]/g, '');

    // Busca o endereço completo usando o ViaCEP
    const viaCepData = await this.viaCepService.getAddress(formattedCep);
    if (!viaCepData.logradouro || !viaCepData.localidade || !viaCepData.uf) {
      throw new Error('Dados incompletos retornados pelo ViaCEP.');
    }

    let coordinates;
    try {
      // Tenta buscar coordenadas usando o CEP
      coordinates = await this.geocodingService.getCoordinates(formattedCep);
    } catch (error) {
      if (error.message.includes('ZERO_RESULTS')) {
        // Tenta buscar coordenadas usando o endereço completo
        const fullAddress = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
        console.log(
          'Tentando geocodificação com endereço completo:',
          fullAddress,
        );
        coordinates = await this.geocodingService.getCoordinates(fullAddress);
      } else {
        throw error;
      }
    }

    // Monta os dados completos da loja
    const newStoreData = {
      name,
      address: `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      phone: 'N/A',
    };

    // Salva no banco de dados
    const newStore = new this.storeModel(newStoreData);
    return newStore.save();
  }
}
