import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();
export const DatabaseConnection = MongooseModule.forRoot(process.env.MONGO_URI);
