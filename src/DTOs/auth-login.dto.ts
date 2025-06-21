import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;
}
