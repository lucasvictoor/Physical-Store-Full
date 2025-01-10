import { PDV_DELIVERY_CONFIG } from '../config';

export function calculatePdvDeliveryTime(distance: number): string {
  if (distance <= 10) {
    return PDV_DELIVERY_CONFIG.TIME_10KM;
  } else if (distance <= 30) {
    return PDV_DELIVERY_CONFIG.TIME_30KM;
  } else if (distance <= 50) {
    return PDV_DELIVERY_CONFIG.TIME_50KM;
  } else {
    return '';
  }
}
