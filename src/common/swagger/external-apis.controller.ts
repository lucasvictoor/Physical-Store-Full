import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

class ApiInfo {
  name: string;
  description: string;
  documentation: string;
}

@ApiTags('APIs Externas')
@Controller('external-apis')
export class ExternalApisController {
  @Get()
  @ApiOperation({ summary: 'Informações sobre as APIs externas utilizadas no projeto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de informações das APIs externas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'ViaCEP' },
          description: {
            type: 'string',
            example: 'Serviço gratuito para consulta de endereços a partir de CEPs no Brasil.'
          },
          documentation: {
            type: 'string',
            example: 'https://viacep.com.br/'
          }
        }
      },
      example: [
        {
          name: 'ViaCEP',
          description: 'Serviço gratuito para consulta de endereços a partir de CEPs no Brasil.',
          documentation: 'https://viacep.com.br/'
        },
        {
          name: 'Google Maps Geocoding API',
          description: 'Serviço que converte endereços em coordenadas geográficas e vice-versa.',
          documentation: 'https://developers.google.com/maps/documentation/geocoding/overview'
        },
        {
          name: 'API dos Correios para Cálculo de Fretes',
          description: 'Serviço dos Correios para calcular valor e prazo de entrega de encomendas.',
          documentation: 'https://www.correios.com.br/atendimento/developers'
        }
      ]
    }
  })
  getExternalApisInfo(): ApiInfo[] {
    return [
      {
        name: 'ViaCEP',
        description: 'Serviço gratuito para consulta de endereços a partir de CEPs no Brasil.',
        documentation: 'https://viacep.com.br/'
      },
      {
        name: 'Google Maps Geocoding API',
        description: 'Serviço que converte endereços em coordenadas geográficas e vice-versa.',
        documentation: 'https://developers.google.com/maps/documentation/geocoding/overview'
      },
      {
        name: 'API dos Correios para Cálculo de Fretes',
        description: 'Serviço dos Correios para calcular valor e prazo de entrega de encomendas.',
        documentation: 'https://www.correios.com.br/atendimento/developers'
      }
    ];
  }
}
