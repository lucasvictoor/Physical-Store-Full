import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const response = await firstValueFrom(
        this.httpService.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address,
          )}&key=${apiKey}`,
        ),
      );

      if (response.data.status !== 'OK') {
        throw new Error('Erro na geocodificação.');
      }

      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      throw new Error(`Erro ao buscar coordenadas: ${error.message}`);
    }
  }
}
