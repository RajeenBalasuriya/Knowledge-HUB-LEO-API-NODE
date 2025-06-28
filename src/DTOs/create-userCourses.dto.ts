import { IsNumber, IsPositive } from 'class-validator';

export class CreateUserCoursesDto {
  @IsNumber()
  @IsPositive()
  crs_id: number;
} 