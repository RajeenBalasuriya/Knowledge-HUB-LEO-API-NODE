import { ICourse } from "../interfaces/ICourse.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { checkRole } from "../utils/checkRole";
import { Course } from "../entities/courses.entity";

export class CourseService {
    async createCourse(user:IJwtUser,courseData:ICourse){

        const {crs_desc,crs_sections,crs_author,crs_rating,crs_img,crs_name,enr_count}=courseData;

       try {
      const course = Course.create({
        crs_name,
        crs_desc,
        crs_sections,
        crs_author,
        crs_rating,
        crs_img,
        enr_count,
      });

      const createdCourse = await course.save();
      return createdCourse;
    } catch (err) {
      const error = new Error("Failed to create course");
      (error as any).status = 500;
      (error as any).code = "COURSE_CREATION_FAILED";
      (error as any).details = err;
      throw error;
    }

    }
}