import { IUserCourses, ICreateUserCourses, IUpdateUserCourses } from "../interfaces/IUserCourses.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { UserCourses } from "../entities/userCourses.entity";
import { Course } from "../entities/courses.entity";
import { User } from "../entities/user.entity";

export class UserCoursesService {
  // Enroll user in a course
  async enrollUserInCourse(user: IJwtUser, enrollmentData: ICreateUserCourses) {
    try {
      // Check if user is already enrolled
      const existingEnrollment = await UserCourses.findOne({
        where: {
          user_id: parseInt(user.id),
          crs_id: enrollmentData.crs_id,
        },
      });

      if (existingEnrollment) {
        const error = new Error("User is already enrolled in this course");
        (error as any).status = 400;
        (error as any).code = "ALREADY_ENROLLED";
        throw error;
      }

      // Check if course exists
      const course = await Course.findOne({
        where: { crs_id: enrollmentData.crs_id },
      });

      if (!course) {
        const error = new Error("Course not found");
        (error as any).status = 404;
        (error as any).code = "COURSE_NOT_FOUND";
        throw error;
      }

      // Create enrollment
      const userCourse = UserCourses.create({
        user_id: parseInt(user.id),
        crs_id: enrollmentData.crs_id,
        enrolled_at: new Date(),
        progress_minutes: 0,
        completed: false,
        last_accessed_at: new Date(),
      });

      const createdEnrollment = await userCourse.save();

      // Update course enrollment count
      course.enr_count += 1;
      await course.save();

      return createdEnrollment;
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to enroll user in course");
      (error as any).status = 500;
      (error as any).code = "ENROLLMENT_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get user's enrolled courses
  async getUserEnrollments(userId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [enrollments, count] = await UserCourses.findAndCount({
        where: { user_id: userId },
        relations: ["course", "user"],
        skip,
        take: limit,
        order: { enrolled_at: "DESC" },
      });

      return {
        enrollments,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit),
        },
      };
    } catch (err: any) {
      const error = new Error("Failed to fetch user enrollments");
      (error as any).status = 500;
      (error as any).code = "GET_ENROLLMENTS_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get specific enrollment
  async getEnrollment(userId: number, courseId: number) {
    try {
      const enrollment = await UserCourses.findOne({
        where: {
          user_id: userId,
          crs_id: courseId,
        },
        relations: ["course", "user"],
      });

      if (!enrollment) {
        const error = new Error("Enrollment not found");
        (error as any).status = 404;
        (error as any).code = "ENROLLMENT_NOT_FOUND";
        throw error;
      }

      return enrollment;
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to fetch enrollment");
      (error as any).status = 500;
      (error as any).code = "GET_ENROLLMENT_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Update enrollment progress
  async updateEnrollment(
    userId: number,
    courseId: number,
    updateData: IUpdateUserCourses
  ) {
    try {
      const enrollment = await UserCourses.findOne({
        where: {
          user_id: userId,
          crs_id: courseId,
        },
      });

      if (!enrollment) {
        const error = new Error("Enrollment not found");
        (error as any).status = 404;
        (error as any).code = "ENROLLMENT_NOT_FOUND";
        throw error;
      }

      // Update fields if provided
      if (updateData.progress_minutes !== undefined) {
        enrollment.progress_minutes = updateData.progress_minutes;
      }
      if (updateData.completed !== undefined) {
        enrollment.completed = updateData.completed;
      }
      if (updateData.last_accessed_at !== undefined) {
        enrollment.last_accessed_at = new Date(updateData.last_accessed_at);
      } else {
        enrollment.last_accessed_at = new Date();
      }

      const updatedEnrollment = await enrollment.save();
      return updatedEnrollment;
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to update enrollment");
      (error as any).status = 500;
      (error as any).code = "UPDATE_ENROLLMENT_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Unenroll user from course
  async unenrollUserFromCourse(userId: number, courseId: number) {
    try {
      const enrollment = await UserCourses.findOne({
        where: {
          user_id: userId,
          crs_id: courseId,
        },
      });

      if (!enrollment) {
        const error = new Error("Enrollment not found");
        (error as any).status = 404;
        (error as any).code = "ENROLLMENT_NOT_FOUND";
        throw error;
      }

      // Delete enrollment
      await enrollment.remove();

      // Update course enrollment count
      const course = await Course.findOne({
        where: { crs_id: courseId },
      });

      if (course && course.enr_count > 0) {
        course.enr_count -= 1;
        await course.save();
      }

      return { message: "Successfully unenrolled from course" };
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to unenroll from course");
      (error as any).status = 500;
      (error as any).code = "UNENROLLMENT_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get course enrollments (for course owners/admins)
  async getCourseEnrollments(courseId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [enrollments, count] = await UserCourses.findAndCount({
        where: { crs_id: courseId },
        relations: ["user", "course"],
        skip,
        take: limit,
        order: { enrolled_at: "DESC" },
      });

      return {
        enrollments,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit),
        },
      };
    } catch (err: any) {
      const error = new Error("Failed to fetch course enrollments");
      (error as any).status = 500;
      (error as any).code = "GET_COURSE_ENROLLMENTS_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
} 