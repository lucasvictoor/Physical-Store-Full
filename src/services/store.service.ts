import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../models/store.model';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findById(id: string): Promise<Store | null> {
    return this.storeModel.findById(id).exec();
  }

  async create(storeData: Partial<Store>): Promise<Store> {
    const newStore = new this.storeModel(storeData);
    return newStore.save();
  }
}
