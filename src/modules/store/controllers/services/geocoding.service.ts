import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(address: string): Promise<{ latitude: number; longitude: number }> {
    this.logger.log(`Buscando coordenadas para o endereço: ${address}`);

    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    if (data.status !== 'OK' || data.results.length === 0) {
      this.logger.warn(`Falha ao buscar coordenadas para o endereço: ${address}`);
      throw new Error(`Erro ao buscar coordenadas: ${data.status}`);
    }

    const { lat, lng } = data.results[0].geometry.location;
    this.logger.log(`Sucesso ao buscar coordendas para o endereço: ${address}`);
    return { latitude: lat, longitude: lng };
  }
}
