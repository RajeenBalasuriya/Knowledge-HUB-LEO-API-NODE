import { IsNumber, IsBoolean, IsOptional, IsPositive, IsDateString } from 'class-validator';

export class UpdateUserCoursesDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  progress_minutes?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsDateString()
  last_accessed_at?: string;
} 