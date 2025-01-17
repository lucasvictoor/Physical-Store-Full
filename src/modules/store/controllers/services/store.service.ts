import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ViaCepService } from './viacep.service';
import { Injectable, Logger } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { GeocodingService } from './geocoding.service';
import { Store } from '../../../../database/models/store.model';
import { calculateDistance } from '../../../../common/utils/conv-distance';
import { calculatePdvDeliveryTime } from '../../../../common/utils/delivery-time';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly geocodingService: GeocodingService,
    private readonly correiosService: CorreiosService
  ) {}

  async findAll(limit: number = 1, offset: number = 0): Promise<{ stores: Store[]; total: number }> {
    this.logger.log(`Buscando todas as lojas com limit: ${limit} e offset: ${offset}`);
    const [stores, total] = await Promise.all([
      this.storeModel.find().skip(offset).limit(limit).exec(),
      this.storeModel.countDocuments().exec()
    ]);

    this.logger.log(`Buscado ${stores.length} lojas de ${total}`);
    return { stores, total };
  }

  async findById(id: string): Promise<Store> {
    this.logger.log(`Buscando loja com ID: ${id}`);
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      this.logger.warn(`Loja com ID ${id} não encontrada!`);
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }
    this.logger.log(`Loja com ID ${id} encontrada com sucesso!`);
    return store;
  }

  async findByState(state: string, limit: number = 1, offset: number = 0): Promise<{ stores: Store[]; total: number }> {
    this.logger.log(`Buscando lojas pelo estado: ${state}`);
    const stores = await this.storeModel
      .find({
        state: { $regex: new RegExp(`^${state}$`, 'i') }
      })
      .skip(offset)
      .limit(limit)
      .exec();

    if (!stores || stores.length === 0) {
      this.logger.warn(`Nenhuma loja encontrada para o estado: ${state}`);
      throw new Error(`Nenhuma loja encontrada para o estado: ${state}`);
    }

    this.logger.log(`Encontrado ${stores.length} lojas para o estado: ${state}`);
    return {
      stores,
      total: stores.length
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    this.logger.log(`Exclui loja com o ID: ${id}`);
    const result = await this.storeModel.findByIdAndDelete(id).exec();

    if (!result) {
      this.logger.warn(`Loja com o ID ${id} não foi encontrada.`);
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }

    this.logger.log(`Loja com o ID ${id} foi deletada com sucesso.`);
    return { message: `Loja com o ID ${id} foi deletada com sucesso.` };
  }

  async updateStore(id: string, updateData: Partial<Store>): Promise<Store> {
    this.logger.log(`Atualizando loja com ID: ${id}`);
    const updatedStore = await this.storeModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      })
      .exec();

    if (!updatedStore) {
      this.logger.warn(`Loja com o ID ${id} não foi atualizada.`);
      throw new Error(`Loja com o ID ${id} não foi encontrada.`);
    }

    this.logger.log(`Loja com ID ${id} atualizada com sucesso!`);
    return updatedStore;
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
    this.logger.log(`Criando uma nova loja com nome: ${storeData.name}`);
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

    this.logger.log(`Loja ${storeData.name} criada com sucesso`);
    const newStore = new this.storeModel(newStoreData);
    return newStore.save();
  }

  async getStoresByCep(
    cep: string,
    limit: number = 1,
    offset: number = 0
  ): Promise<{ nearbyStores: any[]; pins: any[]; total: number }> {
    this.logger.log(`Buscando lojas pelo CEP: ${cep}`);
    try {
      const address = await this.viaCepService.getAddress(cep);
      const fullAddress = `${address.logradouro}, ${address.localidade}, ${address.uf}`;
      const userCoordinates = await this.geocodingService.getCoordinates(fullAddress);

      const stores = await this.storeModel.find();
      const total = stores.length;

      const paginatedStores = stores.slice(offset, offset + limit);

      const nearbyStores = [];
      const pinsMaps = [];

      for (const store of paginatedStores) {
        const distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          store.latitude,
          store.longitude
        );

        let value = [];

        // Aplicando as regras
        if (store.type === 'PDV') {
          if (distance > 50) {
            // Regra (PDV + de 50Km não é listado)
            continue;
          } else {
            // Regra (PDV - de 50Km entrega fixa)
            const deliveryTime = calculatePdvDeliveryTime(distance);
            value = [
              {
                prazo: deliveryTime,
                price: 'R$ 15,00',
                description: 'Motoboy'
              }
            ];
          }
        } else if (store.type === 'Loja') {
          if (distance > 50) {
            // Regra (Loja + de 50Km = Frete Correios)
            try {
              value = await this.correiosService.calcularFrete(cep, store.postalCode);
            } catch (error) {
              console.error(`Erro ao calcular frete para a loja ${store.name}:`, error.message);
              value = [{ error: 'Erro ao calcular frete.' }];
            }
          } else {
            // Regra (Loja - de 50Km entrega igual PVD c/valor fixo)
            const deliveryTime = calculatePdvDeliveryTime(distance);
            value = [
              {
                prazo: deliveryTime,
                price: 'R$ 15,00',
                description: 'Motoboy'
              }
            ];
          }
        } else {
          console.warn(`Tipo de loja não reconhecido: ${store.type}`);
          continue;
        }

        nearbyStores.push({
          name: store.name,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(2)} km`,
          value: value
        });

        pinsMaps.push({
          position: {
            lat: store.latitude,
            lng: store.longitude
          },
          title: store.name
        });
      }

      nearbyStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      this.logger.log(`Achado ${nearbyStores.length} lojas próximas ao CEP: ${cep}`);
      return {
        total,
        nearbyStores,
        pins: pinsMaps
      };
    } catch (error) {
      this.logger.error(`Erro ao processar lojas próximas ao CEP: ${cep}`, error.stack);
      throw new Error('Erro ao processar lojas próximas ao CEP.');
    }
  }
}
