// dtos/create-user.dto.ts
import { IsEmail, IsOptional, IsString, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNumber()
  mobile_no: number;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  profile_img?: string | null;
}
