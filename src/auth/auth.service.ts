import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Users } from './../users/schema/users.schema';
import { LoginAuthDto } from './dto/LoginAuthDto';
import { RegisterAuthDto } from './dto/RegisterAuthDto';
import { encryptPassword } from './lib/encryptPassword';
import { verifyPassword } from './lib/verifyPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;
    const plainToHash = await encryptPassword(password);

    userObject = { ...userObject, password: plainToHash };
    return this.userModel.create(userObject);
  }

  async login(userObject: LoginAuthDto) {
    const { email, password } = userObject;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      throw new HttpException('USER_NOT_FOUND', 404);
    }
    const checkPassword = await verifyPassword(password, findUser);
    if (!checkPassword) {
      throw new HttpException('WRONG_PASSWORD', 403);
    }
    const payload = { id: findUser._id, name: findUser.name };
    const token = this.jwtService.sign(payload);
    const data = {
      user: {
        name: findUser.name,
        last_name: findUser.last_name,
        username: findUser.username,
        email: findUser.email,
        dni: findUser.dni,
      },
      token,
    };
    return data;
  }
}
