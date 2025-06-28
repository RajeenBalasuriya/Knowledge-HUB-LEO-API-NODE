import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class RateCourseDto {
  @IsNumber()
  @IsPositive()
  crs_id: number;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  rating: number;
} 