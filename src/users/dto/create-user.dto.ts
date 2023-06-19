import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
  @IsNotEmpty()
  @MaxLength(20)
  username: string;
  @IsNotEmpty()
  @MaxLength(20)
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 30)
  password: string;
  @IsNotEmpty()
  @Length(8, 8)
  dni: string;
}

export const createUserApiSchema = {
  schema: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      name: { type: 'string' },
      last_name: { type: 'string' },
      dni: { type: 'string' },
      password: { type: 'string' },
    },
  },
  examples: {
    example1: {
      value: {
        username: 'username',
        email: 'email',
        name: 'name',
        last_name: 'last_name',
        dni: 'dni',
        password: 'password',
      },
    },
  },
};
