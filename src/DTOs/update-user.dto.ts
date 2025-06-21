import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsNumber, MinLength } from 'class-validator';

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
  @IsString()
  @MinLength(6)
  password?: string;
  
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