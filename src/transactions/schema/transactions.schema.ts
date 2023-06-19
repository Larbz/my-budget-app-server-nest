import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Transactions {
  @Prop({ required: true, trim: true })
  nameOfTransaction: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  typeOfTransaction: string;

  @Prop({ required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
