
import { IsString, IsUrl, IsInt } from 'class-validator';

export class CreateCourseMaterialDto {
  @IsString()
  material_type: string;

  @IsUrl()
  source_url: string;

  @IsInt()
  crs_id: number; // ID of the related course
}