import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length, MaxLength } from 'class-validator';
import { LoginAuthDto } from './LoginAuthDto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
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
  @Length(8, 8)
  dni: string;
}
