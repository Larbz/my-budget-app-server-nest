import * as bcrypt from 'bcrypt';
import { Users } from './../../users/schema/users.schema';
export const verifyPassword = async (password: string, userModel: Users) => {
  return await bcrypt.compare(password, userModel.password);
};
