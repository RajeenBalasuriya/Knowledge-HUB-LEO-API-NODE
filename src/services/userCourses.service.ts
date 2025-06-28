import { IUserCourses, ICreateUserCourses, IUpdateUserCourses } from "../interfaces/IUserCourses.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { UserCourses } from "../entities/userCourses.entity";
import { Course } from "../entities/courses.entity";
import { User } from "../entities/user.entity";
import { Section } from "../entities/section.entity";

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

  // Get user's enrolled courses with progress calculation
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

      // Calculate progress for each enrollment
      const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          // Get all sections for this course
          const sections = await Section.find({
            where: { course: { crs_id: enrollment.crs_id } },
            select: { section_duration: true },
          });

          // Calculate total course duration
          const totalDuration = sections.reduce((sum, section) => sum + section.section_duration, 0);

          // Calculate progress percentage
          const progressPercentage = totalDuration > 0 
            ? Math.round((enrollment.progress_minutes / totalDuration) * 100)
            : 0;

          // Ensure percentage doesn't exceed 100%
          const finalProgressPercentage = Math.min(progressPercentage, 100);

          return {
            ...enrollment,
            progress: {
              progress_minutes: enrollment.progress_minutes,
              total_duration_minutes: totalDuration,
              progress_percentage: finalProgressPercentage,
              sections_count: sections.length,
            },
          };
        })
      );

      return {
        enrollments: enrollmentsWithProgress,
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

  // Get specific enrollment with progress calculation
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

      // Get all sections for this course
      const sections = await Section.find({
        where: { course: { crs_id: courseId } },
        select: { section_duration: true },
      });

      // Calculate total course duration
      const totalDuration = sections.reduce((sum, section) => sum + section.section_duration, 0);

      // Calculate progress percentage
      const progressPercentage = totalDuration > 0 
        ? Math.round((enrollment.progress_minutes / totalDuration) * 100)
        : 0;

      // Ensure percentage doesn't exceed 100%
      const finalProgressPercentage = Math.min(progressPercentage, 100);

      return {
        ...enrollment,
        progress: {
          progress_minutes: enrollment.progress_minutes,
          total_duration_minutes: totalDuration,
          progress_percentage: finalProgressPercentage,
          sections_count: sections.length,
        },
      };
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