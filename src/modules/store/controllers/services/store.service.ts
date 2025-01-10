import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../../../../database/models/store.model';
import { ViaCepService } from './viacep.service';
import { GeocodingService } from './geocoding.service';
import { calculateDistance } from '../../../../common/utils/conv-distance';
import { CorreiosService } from './correios.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
    private readonly correiosService: CorreiosService
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
    type: string;
  }): Promise<Store> {
    const { name, postalCode, phone, email, takeOutInStore, shippingTimeInDays, country, type } = storeData;

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
      country,
      type,
      city
    };

    const newStore = new this.storeModel(newStoreData);
    return newStore.save();
  }

  async getStoresByCep(cep: string) {
    try {
      const address = await this.viaCepService.getAddress(cep);
      const fullAddress = `${address.logradouro}, ${address.localidade}, ${address.uf}`;
      const userCoordinates = await this.geocodingService.getCoordinates(fullAddress);

      const stores = await this.storeModel.find();

      const nearbyStores = [];

      for (const store of stores) {
        const distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          store.latitude,
          store.longitude
        );

        // Aplicar filtro para incluir apenas lojas dentro de 50 km
        if (distance > 50) {
          continue;
        }

        let value = [];

        if (store.type === 'PDV') {
          value = [
            {
              prazo: '1 dia útil',
              price: 'R$ 15,00',
              description: 'Motoboy'
            }
          ];
        } else if (store.type === 'Loja') {
          try {
            value = await this.correiosService.calcularFrete(cep, store.postalCode);
          } catch (error) {
            console.error(`Erro ao calcular frete para a loja ${store.name}:`, error.message);
            value = [{ error: 'Erro ao calcular frete.' }];
          }
        } else {
          console.warn(`Tipo de loja não reconhecido: ${store.type}`);
        }

        nearbyStores.push({
          name: store.name,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(2)} km`,
          value: value
        });
      }

      nearbyStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      return {
        userCoordinates,
        totalStores: nearbyStores.length,
        nearbyStores
      };
    } catch (error) {
      console.error('Erro em getStoresByCep:', error.message);
      throw new Error('Erro ao processar lojas próximas ao CEP.');
    }
  }
}
