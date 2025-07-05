import { IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";

export class updateSectionDto {
  @IsOptional()
  @IsString()
  sec_name?: string;

  @IsOptional()
  @IsString()
  sec_desc?: string;

  @IsOptional()
  @IsNumber()
  sec_duration?: number;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumber()
  crs_id?: number;
} 