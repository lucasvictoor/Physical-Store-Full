import { Expose } from 'class-transformer';

export class StoreResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() address: string;
  @Expose() latitude: number;
  @Expose() longitude: number;
  @Expose() phone: string;
  @Expose() email: string;
  @Expose() state: string;
  @Expose() takeOutInStore: boolean;
  @Expose() shippingTimeInDays: number;
  @Expose() postalCode: string;
  @Expose() country: string;
  @Expose() type: string;
  @Expose() city: string;
}
