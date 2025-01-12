import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { ViaCepService } from './viacep.service';
import { GeocodingService } from './geocoding.service';
import { getModelToken } from '@nestjs/mongoose';
import { Store } from '../../../../database/models/store.model';
import { CorreiosService } from './correios.service';
import { Model, Document } from 'mongoose';

interface StoreDocument extends Store, Document {}

const mockStoreData = {
  name: 'Test Store',
  postalCode: '12345678',
  phone: '1234567890',
  email: 'test@store.com',
  takeOutInStore: true,
  shippingTimeInDays: 2,
  country: 'Brazil',
  type: 'Loja'
};

const mockViaCepResponse = {
  logradouro: 'Rua Teste',
  localidade: 'Cidade Teste',
  uf: 'SP'
};

const mockGeocodingResponse = {
  latitude: -23.55052,
  longitude: -46.633308
};

describe('Create Store', () => {
  let service: StoreService;
  let storeModel: Model<StoreDocument>;

  beforeEach(async () => {
    function MockModel(data: any) {
      this.data = data;
      this.save = jest.fn().mockResolvedValue({ id: '123', ...data });
    }

    // Mock para o create Store
    MockModel.prototype.save = jest.fn().mockResolvedValue({ id: '123', ...mockStoreData });
    // Mock para o findById
    MockModel.findById = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({ id: '123', ...mockStoreData })
    }));
    // Mock para o Delete Store
    MockModel.findByIdAndDelete = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({ id: '123', ...mockStoreData })
    }));
    // Mock para o Update Store
    MockModel.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({ id: '123', ...mockStoreData })
    }));
    // Mock para o findByState
    MockModel.find = jest.fn().mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getModelToken(Store.name),
          useValue: MockModel
        },
        {
          provide: ViaCepService,
          useValue: {
            getAddress: jest.fn().mockResolvedValue(mockViaCepResponse)
          }
        },
        {
          provide: GeocodingService,
          useValue: {
            getCoordinates: jest.fn().mockResolvedValue(mockGeocodingResponse)
          }
        },
        {
          provide: CorreiosService,
          useValue: {}
        }
      ]
    }).compile();

    service = module.get<StoreService>(StoreService);
    storeModel = module.get<Model<StoreDocument>>(getModelToken(Store.name));
  });

  it('Deve criar uma loja com sucesso!', async () => {
    const result = await service.create(mockStoreData);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', '123');
    expect(result).toMatchObject(mockStoreData);
  });

  // Função teste para FindById
  describe('Buscar por ID', () => {
    it('Deveria retornar uma loja por ID', async () => {
      const mockStore = {
        id: '6780037ac3db9a2007eaf9cf',
        name: 'Loja Teste Recife',
        address: 'Rua Odorico Mendes, Recife, PE',
        latitude: -8.0361194,
        longitude: -34.8802562,
        phone: '81191700014',
        email: 'teste1123411@gmail.com',
        state: 'PE',
        takeOutInStore: true,
        shippingTimeInDays: 11,
        postalCode: '52031-900',
        country: 'Brasil',
        type: 'Loja',
        city: 'Recife'
      };

      (storeModel.findById as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockStore)
      }));

      const result = await service.findById('6780037ac3db9a2007eaf9cf');
      expect(storeModel.findById).toHaveBeenCalledWith('6780037ac3db9a2007eaf9cf');
      expect(result).toEqual(mockStore);
    });

    it('Deve gerar um erro se a loja não for encontrada', async () => {
      (storeModel.findById as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null)
      }));

      await expect(service.findById('6780037ac3db9a2007eaf9cf')).rejects.toThrow(
        'Loja com o ID 6780037ac3db9a2007eaf9cf não foi encontrada.'
      );
      expect(storeModel.findById).toHaveBeenCalledWith('6780037ac3db9a2007eaf9cf');
    });
  });

  // Função teste para Delete Store
  describe('Delete por ID', () => {
    it('Deve excluir uma loja com sucesso', async () => {
      const storeId = '123';
      const mockDeletedStore = { id: storeId, ...mockStoreData };

      (storeModel.findByIdAndDelete as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockDeletedStore)
      }));

      const result = await service.delete(storeId);

      expect(storeModel.findByIdAndDelete).toHaveBeenCalledWith(storeId);
      expect(result).toEqual({
        message: `Loja com o ID ${storeId} foi deletada com sucesso.`
      });
    });

    it('Deve gerar um erro se o armazenamento a ser excluído não for encontrado', async () => {
      const storeId = '123';

      (storeModel.findByIdAndDelete as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null)
      }));

      await expect(service.delete(storeId)).rejects.toThrow(`Loja com o ID ${storeId} não foi encontrada.`);
      expect(storeModel.findByIdAndDelete).toHaveBeenCalledWith(storeId);
    });
  });

  // Função teste para UpdateStore
  describe('Update Store', () => {
    it('Deve atualizar uma loja com sucesso', async () => {
      const storeId = '123';
      const updateData = {
        name: 'Updated Store Name',
        phone: '9876543210'
      };
      const mockUpdatedStore = { id: storeId, ...mockStoreData, ...updateData };

      (storeModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUpdatedStore)
      }));

      const result = await service.updateStore(storeId, updateData);

      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledWith(storeId, updateData, {
        new: true,
        runValidators: true
      });
      expect(result).toEqual(mockUpdatedStore);
    });

    it('Deve gerar um erro se a loja a ser atualizada não for encontrada', async () => {
      const storeId = '123';
      const updateData = {
        name: 'Updated Store Name'
      };

      (storeModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null)
      }));

      await expect(service.updateStore(storeId, updateData)).rejects.toThrow(
        `Loja com o ID ${storeId} não foi encontrada.`
      );
      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledWith(storeId, updateData, {
        new: true,
        runValidators: true
      });
    });
  });

  // Função teste para FindByState
  describe('Buscar por Estado', () => {
    it('Deve retornar lojas para um estado específico', async () => {
      const mockState = 'PE';
      const mockStores = [
        { name: 'Loja 1', state: 'PE' },
        { name: 'Loja 2', state: 'PE' }
      ];

      (storeModel.find as jest.Mock).mockImplementation(() => ({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockStores)
      }));

      const result = await service.findByState(mockState, 2, 0);

      expect(storeModel.find).toHaveBeenCalledWith({
        state: { $regex: new RegExp(`^${mockState}$`, 'i') }
      });
      expect(result).toEqual({ stores: mockStores, total: mockStores.length });
    });

    it('Deve lançar erro caso nenhuma loja seja encontrada', async () => {
      const mockState = 'XX';

      (storeModel.find as jest.Mock).mockImplementation(() => ({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      }));

      await expect(service.findByState(mockState)).rejects.toThrow(
        `Nenhuma loja encontrada para o estado: ${mockState}`
      );

      expect(storeModel.find).toHaveBeenCalledWith({
        state: { $regex: new RegExp(`^${mockState}$`, 'i') }
      });
    });
  });
});
