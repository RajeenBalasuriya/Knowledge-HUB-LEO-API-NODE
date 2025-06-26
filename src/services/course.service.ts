import { ICourse } from "../interfaces/ICourse.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { Course } from "../entities/courses.entity";
import { IUser } from "../interfaces/IUser.interface";

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
        enr_count: true,
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
         const course = await Course.createQueryBuilder("course")
      .leftJoinAndSelect("course.courseMaterials", "courseMaterial")
      .leftJoinAndSelect("course.comments", "comment")
      .leftJoin("comment.user", "user")
      .addSelect(["user.first_name", "user.last_name"])
      .leftJoinAndSelect("course.sections", "section")
      .leftJoinAndSelect("section.questions", "question")
      .leftJoinAndSelect("question.answers", "answer")
      .where("course.crs_id = :id", { id: crs_id })
      .getOne();

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

  // Update course
  async updateCourse(
    user: IUser,
    courseId: number,
    courseData: Partial<ICourse>
  ) {
    try {
      const course = await Course.findOne({
        where: { crs_id: courseId },
      });

      if (!course) {
        const error = new Error("Course not found");
        (error as any).status = 404;
        (error as any).code = "COURSE_NOT_FOUND";
        throw error;
      }

      // Update course properties
      course.crs_name = courseData.crs_name;
      course.crs_desc = courseData.crs_desc;
      course.crs_sections = courseData.crs_sections;
      course.crs_author = courseData.crs_author;
      course.crs_rating = courseData.crs_rating;
      course.crs_img = courseData.crs_img;
      course.enr_count = courseData.enr_count;

      await course.save();

      return course;
    } catch (err: any) {
      const error = new Error("Failed to update course");
      (error as any).status = 500;
      (error as any).code = "COURSE_UPDATE_FAILED";
      (error as any).details = {
        message: err.message,
        code: err.code || undefined,
      };
      throw error;
    }
  }

  //delete course
  async deleteCourse(courseId: number) {
    try {
      const course = await Course.findOne({
        where: { crs_id: courseId },
      });

      if (!course) {
        const error = new Error("Course not found");
        (error as any).status = 404;
        (error as any).code = "COURSE_NOT_FOUND";
        throw error;
      }

      await course.remove();
      return course;
    } catch (err: any) {
      const error = new Error("Failed to delete course");
      (error as any).status = 500;
      (error as any).code = "COURSE_DELETION_FAILED";
      (error as any).details = {
        message: err.message,
        code: err.code || undefined,
      };
      throw error;
    }
  }
}
