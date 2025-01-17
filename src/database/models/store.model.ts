import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Store extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  takeOutInStore: boolean;

  @Prop({ required: true })
  shippingTimeInDays: number;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true, enum: ['PDV', 'Loja'] })
  type: string;

  @Prop({ required: true })
  city: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
