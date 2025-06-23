import { NextFunction,Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { ICourseMaterial } from "../interfaces/ICourseMaterial.interface";
import { CourseMaterialService } from "../services/courseMaterial.service";

const courseMaterialService = new CourseMaterialService();

//create course controller
export const createCourseMaterial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const courseMaterialToCreate: ICourseMaterial= req.body;

    const courseMaterialCreatedd = await courseMaterialService.createCourseMaterial(
      courseMaterialToCreate
    );

    res.status(201).json({
      status: "success",
      message: "Course material created successfully",
      data: {
        courseMaterial: {
          id: courseMaterialCreatedd.crs_m_id,
          type: courseMaterialCreatedd.material_type,
          sourceUrl: courseMaterialCreatedd.source_url,
          courseId: courseMaterialCreatedd.course.crs_id,
        },
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};
