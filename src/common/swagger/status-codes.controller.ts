import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Códigos de Status HTTP')
@Controller('status-codes')
export class StatusCodesController {
  @Get()
  @ApiOperation({ summary: 'Lista de códigos de status HTTP utilizados na API' })
  @ApiResponse({
    status: 200,
    description: 'Lista de códigos de status HTTP e seus significados',
    schema: {
      type: 'object',
      properties: {
        200: { type: 'string', example: 'Sucesso. A requisição foi processada corretamente.' },
        201: { type: 'string', example: 'Criado. Um novo recurso foi criado com sucesso.' },
        400: { type: 'string', example: 'Requisição inválida. O cliente enviou dados incorretos.' },
        404: { type: 'string', example: 'Não encontrado. O recurso solicitado não foi localizado.' },
        500: { type: 'string', example: 'Erro interno do servidor. Algo deu errado no servidor.' }
      }
    }
  })
  getStatusCodes(): Record<string, string> {
    return {
      '200': 'Sucesso. A requisição foi processada corretamente.',
      '201': 'Criado. Um novo recurso foi criado com sucesso.',
      '400': 'Requisição inválida. O cliente enviou dados incorretos.',
      '404': 'Não encontrado. O recurso solicitado não foi localizado.',
      '500': 'Erro interno do servidor. Algo deu errado no servidor.'
    };
  }
}
