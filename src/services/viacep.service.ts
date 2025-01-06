import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ViaCepService {
  constructor(private readonly httpService: HttpService) {}

  async getAddress(cep: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`),
      );

      if (response.data.erro) {
        throw new Error('CEP inválido.');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar CEP: ${error.message}`);
    }
  }
}
