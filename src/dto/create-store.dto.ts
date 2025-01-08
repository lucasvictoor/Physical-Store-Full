import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  takeOutInStore: boolean;

  @IsNotEmpty()
  @IsNumber()
  shippingTimeInDays: number;

  @IsNotEmpty()
  @IsString()
  country: string;
}
