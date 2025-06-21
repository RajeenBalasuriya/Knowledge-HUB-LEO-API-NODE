import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
  
  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  mobile_no?: number;
  
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  profile_img?: string | null;
}