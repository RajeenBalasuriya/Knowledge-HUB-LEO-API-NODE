import { IsNumber, IsString, IsOptional } from "class-validator";

export class createSectionDto {
  @IsString()
  sec_name: string;

  @IsString()
  sec_desc: string;

  @IsNumber()
  sec_duration: number;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsNumber()
  crs_id: number; // ID of the related course
}