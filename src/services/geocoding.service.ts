import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(address: string): Promise<{ latitude: number; longitude: number }> {
    console.log(`Buscando coordenadas para o endereço: ${address}`);

    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    if (data.status !== 'OK' || data.results.length === 0) {
      throw new Error(`Erro ao buscar coordenadas: ${data.status}`);
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  }
}
