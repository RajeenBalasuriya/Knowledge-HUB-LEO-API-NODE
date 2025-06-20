// dtos/create-user.dto.ts
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  mobile_no: number;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  profile_img?: string | null;
}
