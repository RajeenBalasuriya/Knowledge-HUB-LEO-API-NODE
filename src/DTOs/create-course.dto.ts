
import { IsString, IsNumber, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  crs_desc: string;

  @IsNumber()
  crs_sections: number;

  @IsString()
  crs_author: string;

  @IsNumber()
  crs_rating: number;

  @IsUrl()
  crs_img: string;

  @IsString()
  crs_name: string;

  @IsNumber()
  enr_count: number;
}
