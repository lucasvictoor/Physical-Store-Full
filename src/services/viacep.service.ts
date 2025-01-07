import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ViaCepService {
  constructor(private readonly httpService: HttpService) {}

  async getAddress(cep: string): Promise<{ logradouro: string; localidade: string; uf: string }> {
    try {
      const response = await firstValueFrom(this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`));

      if (response.data.erro) {
        throw new Error('CEP inválido.');
      }

      return {
        logradouro: response.data.logradouro,
        localidade: response.data.localidade,
        uf: response.data.uf
      };
    } catch (error) {
      throw new Error(`Erro ao buscar CEP: ${error.message}`);
    }
  }
}
