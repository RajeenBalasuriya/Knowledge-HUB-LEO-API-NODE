import { IsString, IsOptional, IsNumber } from 'class-validator';

export class createQuestionDto {
  @IsString()
  question: string;

  @IsString()
  question_solution: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsNumber()
  section_id: number;
}
