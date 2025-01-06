import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(
    query: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;

      const response = await firstValueFrom(
        this.httpService.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            query,
          )}&key=${apiKey}`,
        ),
      );

      console.log('Google Geocoding Response:', response.data);

      if (response.data.status !== 'OK') {
        throw new Error(
          `Erro na geocodificação: ${response.data.status} - ${response.data.error_message || ''}`,
        );
      }

      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      console.error(
        `Erro ao buscar coordenadas para a consulta "${query}":`,
        error.message,
      );
      throw new Error(`Erro ao buscar coordenadas: ${error.message}`);
    }
  }
}
