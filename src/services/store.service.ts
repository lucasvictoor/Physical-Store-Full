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

  async findByState(state: string): Promise<{ stores: Store[]; total: number }> {
    const stores = await this.storeModel
      .find({
        state: { $regex: new RegExp(`^${state}$`, 'i') }
      })
      .exec();

    if (!stores || stores.length === 0) {
      throw new Error(`Nenhuma loja encontrada para o estado: ${state}`);
    }

    return {
      stores,
      total: stores.length
    };
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
    phone: string;
    email: string;
    takeOutInStore: boolean;
    shippingTimeInDays: number;
    country: string;
  }): Promise<Store> {
    const { name, postalCode, phone, email, takeOutInStore, shippingTimeInDays, country } = storeData;

    const formattedCep = postalCode.replace(/[^0-9]/g, '');

    // Busca o endereço completo usando o ViaCEP
    const viaCepData = await this.viaCepService.getAddress(formattedCep);
    if (!viaCepData.logradouro || !viaCepData.localidade || !viaCepData.uf) {
      throw new Error('Dados incompletos retornados pelo ViaCEP.');
    }

    const state = viaCepData.uf;
    const city = viaCepData.localidade;
    const address = `${viaCepData.logradouro}, ${city}, ${state}`;

    // Busca as coordenadas usando o Geocoding
    const coordinates = await this.geocodingService.getCoordinates(address);

    const newStoreData = {
      name,
      address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      phone,
      email,
      state,
      takeOutInStore,
      shippingTimeInDays,
      postalCode,
      country
    };

    const newStore = new this.storeModel(newStoreData);
    return newStore.save();
  }

  async getStoresByCepWithType(userCep: string): Promise<any> {
    const userAddress = await this.viaCepService.getAddress(userCep);
    if (!userAddress || !userAddress.logradouro || !userAddress.localidade || !userAddress.uf) {
      throw new Error('CEP inválido ou não encontrado.');
    }

    // Coordenadas
    const fullUserAddress = `${userAddress.logradouro}, ${userAddress.localidade}, ${userAddress.uf}`;
    const userCoordinates = await this.geocodingService.getCoordinates(fullUserAddress);

    const stores = await this.storeModel.find().exec();

    // Classificar as lojas
    const storesWithType = stores.map((store) => {
      const distance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        store.latitude,
        store.longitude
      );

      const type = distance <= 50 ? 'PDV' : 'Loja';

      return {
        ...store.toObject(),
        distance: parseFloat(distance.toFixed(2)),
        type
      };
    });

    return {
      totalStores: storesWithType.length,
      stores: storesWithType.sort((a, b) => a.distance - b.distance)
    };
  }
}
