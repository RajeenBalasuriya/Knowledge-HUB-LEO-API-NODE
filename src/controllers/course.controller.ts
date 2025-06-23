import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { CourseService } from "../services/course.service";
import { ICourse } from "../interfaces/ICourse.interface";

const courseService = new CourseService();
//create course controller
export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const courseToCreate: ICourse = req.body;

    const courseCreated = await courseService.createCourse(
      user,
      courseToCreate
    );

    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      data: {
        course: {
          id: courseCreated.crs_id,
          name: courseCreated.crs_name,
          author: courseCreated.crs_author,
          rating: courseCreated.crs_rating,
          sections: courseCreated.crs_sections,
          description: courseCreated.crs_desc,
          image: courseCreated.crs_img,
        },
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

//read course controller
export const readAllCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { plainCourses, meta } = await courseService.getAllCourses(page, limit);

    res.status(200).json({
      status: "success",
      data: {
        courses: plainCourses,
        meta,
      },
    });
  } catch (err) {
    next(err);
  }
};

//read course by id controller
export const readCourseById = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await courseService.getCourseById(courseId);

    if (!course) {
      res.status(404).json({
        status: "error",
        message: "Course not found",
        error: {
          code: "COURSE_NOT_FOUND",
          details: `No course found with id ${courseId}`,
        },
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
       course,
       meta:null
      },
    });
  } catch (err) {
    next(err);
  }
};
