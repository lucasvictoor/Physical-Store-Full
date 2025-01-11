import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Histórico de Versões')
@Controller('changelog')
export class ChangelogController {
  @Get()
  @ApiOperation({ summary: 'Histórico de alterações e versões da API' })
  @ApiResponse({
    status: 200,
    description: '1º Versão da API',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          version: { type: 'string', example: '1.0.0' },
          date: { type: 'string', example: '2024-10-10' },
          changes: {
            type: 'array',
            items: {
              type: 'string',
              example:
                '1º Versão da API, a qual tinha o objetivo principal onde os usuários podessem localizar as unidades mais próximas com base no CEP fornecido. Link GitHub: https://github.com/lucasvictoor/Physical-Store'
            }
          }
        }
      }
    }
  })
  getChangelog(): any[] {
    return [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [
          'Implementação dos endpoints básicos: criar, listar, editar e deletar lojas.',
          'Documentação inicial com Swagger.'
        ]
      },
      {
        version: '1.1.0',
        date: '2025-02-01',
        changes: [
          'Adicionado o endpoint de busca por estado.',
          'Melhorias na validação de CEP no endpoint de busca por CEP.'
        ]
      },
      {
        version: '1.2.0',
        date: '2025-03-01',
        changes: [
          'Adicionado suporte a APIs externas (ViaCEP, Correios e Google Maps Geocoding).',
          'Documentação atualizada com seção de APIs externas.'
        ]
      }
    ];
  }
}
