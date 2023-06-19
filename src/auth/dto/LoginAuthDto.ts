import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}
