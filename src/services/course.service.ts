import { ICourse } from "../interfaces/ICourse.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { Course } from "../entities/courses.entity";
import { IUser } from "../interfaces/IUser.interface";
import { ILike } from "typeorm";
import { IRateCourse, IRatingResponse } from "../interfaces/ICourseRating.interface";
import { UserCourses } from "../entities/userCourses.entity";

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
        rating_count: 0, // Initialize rating count to 0
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
        rating_count: true,
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

  //search courses by name
async searchCoursesByName(name: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  console.log(`Searching for courses with name starting with: ${name}`);
  const [courses, count] = await Course.findAndCount({
    where: {
      crs_name: ILike(`${name}%`), // matches names starting with 'name'
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
      enr_count: true,
      rating_count: true,
    },
  });

  return {
    plainCourses: JSON.parse(JSON.stringify(courses)),
    meta: {
      total: count,
      page,
      last_page: Math.ceil(count / limit),
    },
  };
}

  // Rate a course
  async rateCourse(user: IJwtUser, ratingData: IRateCourse): Promise<IRatingResponse> {
    try {
      const course = await Course.findOne({
        where: { crs_id: ratingData.crs_id },
      });

      if (!course) {
        const error = new Error("Course not found");
        (error as any).status = 404;
        (error as any).code = "COURSE_NOT_FOUND";
        throw error;
      }

      // Check if user is enrolled in the course
      const enrollment = await UserCourses.findOne({
        where: {
          user_id: parseInt(user.id),
          crs_id: ratingData.crs_id,
        },
      });

      if (!enrollment) {
        const error = new Error("You must be enrolled in this course to rate it");
        (error as any).status = 403;
        (error as any).code = "NOT_ENROLLED";
        throw error;
      }

      // Validate rating range
      if (ratingData.rating < 1 || ratingData.rating > 5) {
        const error = new Error("Rating must be between 1 and 5");
        (error as any).status = 400;
        (error as any).code = "INVALID_RATING";
        throw error;
      }

      // Calculate new average rating
      const currentTotal = course.crs_rating * course.rating_count;
      const newTotal = currentTotal + ratingData.rating;
      const newRatingCount = course.rating_count + 1;
      const newAverageRating = Math.round((newTotal / newRatingCount) * 10) / 10; // Round to 1 decimal place

      // Update course rating
      course.crs_rating = newAverageRating;
      course.rating_count = newRatingCount;

      await course.save();

      return {
        course_id: course.crs_id,
        new_average_rating: newAverageRating,
        total_ratings: newRatingCount,
        user_rating: ratingData.rating,
      };
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to rate course");
      (error as any).status = 500;
      (error as any).code = "RATE_COURSE_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get course rating statistics
  async getCourseRatingStats(courseId: number) {
    try {
      const course = await Course.findOne({
        where: { crs_id: courseId },
        select: {
          crs_id: true,
          crs_rating: true,
          rating_count: true,
        },
      });

      if (!course) {
        const error = new Error("Course not found");
        (error as any).status = 404;
        (error as any).code = "COURSE_NOT_FOUND";
        throw error;
      }

      return {
        course_id: course.crs_id,
        average_rating: course.crs_rating,
        total_ratings: course.rating_count,
        rating_percentage: course.rating_count > 0 ? Math.round((course.crs_rating / 5) * 100) : 0,
      };
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to get course rating stats");
      (error as any).status = 500;
      (error as any).code = "GET_RATING_STATS_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
}
