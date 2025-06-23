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
