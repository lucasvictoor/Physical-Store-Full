import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CorreiosService {
  constructor(private readonly httpService: HttpService) {}

  async calcularFrete(cepOrigem: string, cepDestino: string) {
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
        throw new Error('Nenhuma resposta válida recebida dos Correios.');
      }

      const freteData = response.data.map((item) => ({
        prazo: `${item.prazo}`,
        price: `R$ ${parseFloat(item.precoAgencia).toFixed(2)}`,
        description: item.urlTitulo
      }));

      return freteData;
    } catch (error) {
      console.error('Erro ao calcular frete:', error.message);
      throw new Error('Erro ao integrar com a API dos Correios.');
    }
  }
}
