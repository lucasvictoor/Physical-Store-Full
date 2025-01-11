import { ApiBodyOptions, ApiResponseOptions } from '@nestjs/swagger';

// Schema para o endpoint de criar loja
export const createStoreSchema: { body: ApiBodyOptions; response: ApiResponseOptions } = {
  body: {
    description: 'Dados para criar uma nova loja',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Loja Teste Recife' },
        postalCode: { type: 'string', example: '52031-900' },
        phone: { type: 'string', example: '81191700014' },
        email: { type: 'string', example: 'teste1123411@gmail.com' },
        takeOutInStore: { type: 'boolean', example: true },
        shippingTimeInDays: { type: 'number', example: 11 },
        country: { type: 'string', example: 'Brasil' },
        type: { type: 'string', enum: ['PDV', 'Loja'], example: 'Loja' },
        city: { type: 'string', example: 'Recife' }
      },
      required: [
        'name',
        'postalCode',
        'phone',
        'email',
        'takeOutInStore',
        'shippingTimeInDays',
        'country',
        'type',
        'city'
      ]
    }
  },
  response: {
    description: 'Loja criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '6780037ac3db9a2007eaf9cf' },
        name: { type: 'string', example: 'Loja Teste Recife' },
        address: { type: 'string', example: 'Rua Odorico Mendes, Recife, PE' },
        latitude: { type: 'number', example: -8.0361194 },
        longitude: { type: 'number', example: -34.8802562 },
        phone: { type: 'string', example: '81191700014' },
        email: { type: 'string', example: 'teste1123411@gmail.com' },
        state: { type: 'string', example: 'PE' },
        takeOutInStore: { type: 'boolean', example: true },
        shippingTimeInDays: { type: 'number', example: 11 },
        postalCode: { type: 'string', example: '52031-900' },
        country: { type: 'string', example: 'Brasil' },
        type: { type: 'string', example: 'Loja' },
        city: { type: 'string', example: 'Recife' }
      }
    }
  }
};

// Schema para o endpoint de listar lojas
export const listStoresSchema: ApiResponseOptions = {
  description: 'Lista de lojas',
  schema: {
    type: 'object',
    properties: {
      stores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6780037ac3db9a2007eaf9cf' },
            name: { type: 'string', example: 'Loja Teste Recife' },
            address: { type: 'string', example: 'Rua Odorico Mendes, Recife, PE' },
            latitude: { type: 'number', example: -8.0361194 },
            longitude: { type: 'number', example: -34.8802562 },
            phone: { type: 'string', example: '81191700014' },
            email: { type: 'string', example: 'teste1123411@gmail.com' },
            state: { type: 'string', example: 'PE' },
            takeOutInStore: { type: 'boolean', example: true },
            shippingTimeInDays: { type: 'number', example: 11 },
            postalCode: { type: 'string', example: '52031-900' },
            country: { type: 'string', example: 'Brasil' },
            type: { type: 'string', example: 'Loja' },
            city: { type: 'string', example: 'Recife' }
          }
        }
      },
      limit: { type: 'number', example: 10 },
      offset: { type: 'number', example: 0 },
      total: { type: 'number', example: 1 }
    }
  }
};

// Schema para o endpoint de editar loja
export const editStoreSchema: { body: ApiBodyOptions; response: ApiResponseOptions } = {
  body: {
    description: 'Dados para editar uma loja. Apenas os campos a serem alterados precisam ser enviados.',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Novo Nome da Loja' },
        phone: { type: 'string', example: '81191700015' },
        email: { type: 'string', example: 'novoemail@gmail.com' },
        takeOutInStore: { type: 'boolean', example: false },
        shippingTimeInDays: { type: 'number', example: 5 },
        city: { type: 'string', example: 'Olinda' }
      }
    }
  },
  response: {
    description: 'Loja editada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '6780037ac3db9a2007eaf9cf' },
        name: { type: 'string', example: 'Novo Nome da Loja' },
        phone: { type: 'string', example: '81191700015' },
        email: { type: 'string', example: 'novoemail@gmail.com' },
        takeOutInStore: { type: 'boolean', example: false },
        shippingTimeInDays: { type: 'number', example: 5 },
        city: { type: 'string', example: 'Olinda' },
        state: { type: 'string', example: 'PE' }
      }
    }
  }
};

// Schema para o endpoint de deletar loja
export const deleteStoreSchema: ApiResponseOptions = {
  description: 'Mensagem de confirmação após deletar a loja',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Loja com o ID 6780037ac3db9a2007eaf9cf foi deletada com sucesso.' }
    }
  }
};

// Schema para o endpoint de buscar loja por ID
export const getStoreByIdSchema: ApiResponseOptions = {
  description: 'Detalhes de uma loja específica',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '6780037ac3db9a2007eaf9cf' },
      name: { type: 'string', example: 'Loja Teste Recife' },
      address: { type: 'string', example: 'Rua Odorico Mendes, Recife, PE' },
      latitude: { type: 'number', example: -8.0361194 },
      longitude: { type: 'number', example: -34.8802562 },
      phone: { type: 'string', example: '81191700014' },
      email: { type: 'string', example: 'teste1123411@gmail.com' },
      state: { type: 'string', example: 'PE' },
      takeOutInStore: { type: 'boolean', example: true },
      shippingTimeInDays: { type: 'number', example: 11 },
      postalCode: { type: 'string', example: '52031-900' },
      country: { type: 'string', example: 'Brasil' },
      type: { type: 'string', example: 'Loja' },
      city: { type: 'string', example: 'Recife' }
    }
  }
};

// Schema para o endpoint de buscar lojas por estado
export const getStoresByStateSchema: ApiResponseOptions = {
  description: 'Lista de lojas de um estado específico',
  schema: {
    type: 'object',
    properties: {
      stores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '6780037ac3db9a2007eaf9cf' },
            name: { type: 'string', example: 'Loja Teste Recife' },
            address: { type: 'string', example: 'Rua Odorico Mendes, Recife, PE' },
            latitude: { type: 'number', example: -8.0361194 },
            longitude: { type: 'number', example: -34.8802562 },
            phone: { type: 'string', example: '81191700014' },
            email: { type: 'string', example: 'teste1123411@gmail.com' },
            state: { type: 'string', example: 'PE' },
            takeOutInStore: { type: 'boolean', example: true },
            shippingTimeInDays: { type: 'number', example: 11 },
            postalCode: { type: 'string', example: '52031-900' },
            country: { type: 'string', example: 'Brasil' },
            type: { type: 'string', example: 'Loja' },
            city: { type: 'string', example: 'Recife' }
          }
        }
      },
      total: { type: 'number', example: 2 }
    }
  }
};

// Schema para o endpoint de buscar lojas por CEP
export const getStoresByCepSchema: ApiResponseOptions = {
  description: 'Lista de lojas próximas ao CEP fornecido, com detalhes de entrega',
  schema: {
    type: 'object',
    properties: {
      totalStores: { type: 'number', example: 3 },
      nearbyStores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Loja Teste Recife' },
            city: { type: 'string', example: 'Recife' },
            postalCode: { type: 'string', example: '52031-900' },
            type: { type: 'string', enum: ['PDV', 'Loja'], example: 'Loja' },
            distance: { type: 'string', example: '15.3 km' },
            value: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  prazo: { type: 'number', example: 5 },
                  price: { type: 'string', example: 'R$ 15,00' },
                  description: { type: 'string', example: 'Motoboy' }
                }
              }
            }
          }
        }
      },
      pinsMaps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: -8.0361194 },
                lng: { type: 'number', example: -34.8802562 }
              }
            },
            title: { type: 'string', example: 'Loja Teste Recife' }
          }
        }
      }
    }
  }
};
