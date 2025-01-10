import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CorreiosService {
  private readonly logger = new Logger(CorreiosService.name);
  constructor(private readonly httpService: HttpService) {}

  async calcularFrete(cepOrigem: string, cepDestino: string) {
    this.logger.log(`Calculando frete do CEP ${cepOrigem} para o CEP ${cepDestino}`);
    try {
      const payload = {
        cepDestino: cepDestino.replace('-', ''),
        cepOrigem: cepOrigem.replace('-', ''),
        comprimento: '20',
        largura: '15',
        altura: '10'
      };

      const response = await firstValueFrom(
        this.httpService.post('https://www.correios.com.br/@@precosEPrazosView', payload, {
          headers: { 'Content-Type': 'application/json' }
        })
      );

      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        this.logger.warn(`Nenhuma resposta válida recebida dos Correios: ${JSON.stringify(payload)}`);
        throw new Error('Nenhuma resposta válida recebida dos Correios.');
      }

      this.logger.log(`Dados de frete obtidos com sucesso para o CEP: ${cepOrigem} -> ${cepDestino}`);
      const freteData = response.data.map((item) => ({
        prazo: `${item.prazo}`,
        price: `R$ ${parseFloat(item.precoAgencia).toFixed(2)}`,
        description: item.urlTitulo
      }));

      return freteData;
    } catch (error) {
      this.logger.error(`Error ao calcular frete do CEP ${cepOrigem} para o CEP ${cepDestino}`, error.stack);
      throw new Error('Erro ao integrar com a API dos Correios.');
    }
  }
}
