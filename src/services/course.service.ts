import { ICourse } from "../interfaces/ICourse.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { Course } from "../entities/courses.entity";

export class CourseService {
  async createCourse(user: IJwtUser, courseData: ICourse) {
    const {
      crs_desc,
      crs_sections,
      crs_author,
      crs_rating,
      crs_img,
      crs_name,
      enr_count,
    } = courseData;

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

  //read all courses
  async getAllCourses(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [courses, count] = await Course.findAndCount({
    relations: {
        courseMaterials: true,
      },
      skip,
      take: limit,
      order: {
        crs_name: "ASC",
      },
      select: {
        crs_id: true,
        crs_name: true,
        crs_author: true,
        crs_rating: true,
        crs_sections: true,
        crs_desc: true,
        crs_img: true,
      },
    });
    const plainCourses = JSON.parse(JSON.stringify(courses));

    return {
      plainCourses,
      meta: {
        total: count,
        page,
        last_page: Math.ceil(count / limit),
      },
    };
  }

  //read course by id
async getCourseById(crs_id: number) {
  try {
    const [course] = await Course.findAndCount({
      relations: {
        courseMaterials: true,
      },
      where: { crs_id },
    });
    

    if (!course) {
      const error = new Error("Course not found");
      (error as any).status = 404;
      (error as any).code = "COURSE_NOT_FOUND";
      throw error;
    }

    return course;
  } catch (err: any) {
    const error = new Error("Failed to fetch course by ID");
    (error as any).status = 500;
    (error as any).code = "GET_COURSE_BY_ID_FAILED";
    (error as any).details = {
      message: err.message,
      code: err.code || undefined,
    };
    throw error;
  }
}
}
