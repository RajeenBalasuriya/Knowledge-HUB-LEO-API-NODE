import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { UserCoursesService } from "../services/userCourses.service";
import { ICreateUserCourses, IUpdateUserCourses } from "../interfaces/IUserCourses.interface";

const userCoursesService = new UserCoursesService();

// Enroll user in course
export const enrollUserInCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const enrollmentData: ICreateUserCourses = req.body;

    const enrollment = await userCoursesService.enrollUserInCourse(
      user,
      enrollmentData
    );

    res.status(201).json({
      status: "success",
      message: "Successfully enrolled in course",
      data: {
        enrollment: {
          user_id: enrollment.user_id,
          crs_id: enrollment.crs_id,
          enrolled_at: enrollment.enrolled_at,
          progress_minutes: enrollment.progress_minutes,
          completed: enrollment.completed,
          last_accessed_at: enrollment.last_accessed_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user's enrolled courses
export const getUserEnrollments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    let completed: boolean | undefined = undefined;
    if (typeof req.query.completed === 'string') {
      if (req.query.completed === 'true') completed = true;
      if (req.query.completed === 'false') completed = false;
    }

    const { enrollments, meta } = await userCoursesService.getUserEnrollments(
      parseInt(user.id),
      page,
      limit,
      completed
    );

    res.status(200).json({
      status: "success",
      data: {
        enrollments,
        meta,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get specific enrollment
export const getEnrollment = async (
  req: AuthRequest<{ courseId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const courseId = parseInt(req.params.courseId);

    const enrollment = await userCoursesService.getEnrollment(
      parseInt(user.id),
      courseId
    );

    res.status(200).json({
      status: "success",
      data: {
        enrollment,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update enrollment progress
export const updateEnrollment = async (
  req: AuthRequest<{ courseId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const courseId = parseInt(req.params.courseId);
    const updateData: IUpdateUserCourses = req.body;

    const updatedEnrollment = await userCoursesService.updateEnrollment(
      parseInt(user.id),
      courseId,
      updateData
    );

    res.status(200).json({
      status: "success",
      message: "Enrollment updated successfully",
      data: {
        enrollment: {
          user_id: updatedEnrollment.user_id,
          crs_id: updatedEnrollment.crs_id,
          enrolled_at: updatedEnrollment.enrolled_at,
          progress_minutes: updatedEnrollment.progress_minutes,
          completed: updatedEnrollment.completed,
          last_accessed_at: updatedEnrollment.last_accessed_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Unenroll user from course
export const unenrollUserFromCourse = async (
  req: AuthRequest<{ courseId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const courseId = parseInt(req.params.courseId);

    const result = await userCoursesService.unenrollUserFromCourse(
      parseInt(user.id),
      courseId
    );

    res.status(200).json({
      status: "success",
      message: result.message,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Get course enrollments (for course owners/admins)
export const getCourseEnrollments = async (
  req: AuthRequest<{ courseId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { enrollments, meta } = await userCoursesService.getCourseEnrollments(
      courseId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: {
        enrollments,
        meta,
      },
    });
  } catch (err) {
    next(err);
  }
}; 