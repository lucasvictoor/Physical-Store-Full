import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../models/store.model';
import { ViaCepService } from './viacep.service';
import { GeocodingService } from './geocoding.service';
import { calculateDistance } from '../utils/conv-distance';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService
  ) {}

  async findAll(limit = 10, offset = 0): Promise<{ stores: Store[]; total: number }> {
    const [stores, total] = await Promise.all([
      this.storeModel.find().skip(offset).limit(limit).exec(),
      this.storeModel.countDocuments().exec()
    ]);

    return { stores, total };
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }
    return store;
  }

  async findByCep(cep: string): Promise<any> {
    console.log('CEP recebido no serviço:', cep);

    const viaCepData = await this.viaCepService.getAddress(cep);
    if (!viaCepData) {
      throw new Error('CEP inválido ou não encontrado.');
    }

    console.log('Dados do ViaCEP:', viaCepData);

    // Buscar coordenadas pelo endereço completo
    const fullAddress = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
    console.log('Buscando coordenadas para o endereço completo:', fullAddress);
    const userCoordinates = await this.geocodingService.getCoordinates(fullAddress);

    console.log('Coordenadas do endereço fornecido:', userCoordinates);

    const stores = await this.storeModel.find().exec();

    const storesWithDistance = stores.map((store) => {
      const distance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        store.latitude,
        store.longitude
      );

      const formattedDistance = parseFloat(distance.toFixed(2));
      const deliveryType = formattedDistance <= 50 ? 'Motoboy' : 'Correios';

      return {
        ...store.toObject(),
        distance: formattedDistance,
        deliveryType
      };
    });

    // Verificar se há lojas próximas
    if (storesWithDistance.length === 0) {
      return { message: 'Nenhuma loja encontrada próxima ao CEP fornecido.' };
    }

    // Ordenar por distância e formatar a resposta
    return {
      totalStores: storesWithDistance.length,
      stores: storesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .map((store) => ({
          id: store._id,
          name: store.name,
          location: {
            address: store.address,
            latitude: store.latitude,
            longitude: store.longitude,
            distance: `${store.distance} km`
          },
          deliveryType: store.deliveryType
        }))
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.storeModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }

    return { message: `Loja com o ID ${id} foi deletada com sucesso.` };
  }

  async create(storeData: { name: string; postalCode: string }): Promise<Store> {
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
        console.log('Tentando geocodificação com endereço completo:', fullAddress);
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
      phone: 'N/A'
    };

    // Salva no banco de dados
    const newStore = new this.storeModel(newStoreData);
    return newStore.save();
  }
}
