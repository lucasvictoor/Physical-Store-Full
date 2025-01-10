import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);

  constructor(private readonly httpService: HttpService) {}

  async getAddress(cep: string): Promise<{ logradouro: string; localidade: string; uf: string }> {
    try {
      this.logger.log(`Buscando endereços pelo CEP: ${cep}`);
      const response = await firstValueFrom(this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`));

      if (response.data.erro) {
        this.logger.warn(`CEP inválido: ${cep}`);
        throw new Error('CEP inválido.');
      }

      this.logger.log(`Sucesso ao buscar endereço para o CEP: ${cep}`);
      return {
        logradouro: response.data.logradouro,
        localidade: response.data.localidade,
        uf: response.data.uf
      };
    } catch (error) {
      this.logger.error(`Error ao buscar endereço para o CEP: ${cep}`, error.stack);
      throw new Error(`Erro ao buscar CEP: ${error.message}`);
    }
  }
}
