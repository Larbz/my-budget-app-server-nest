import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  dni: string;

  @Prop({ required: true, trim: true })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.methods.encryptPassword = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

UsersSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
