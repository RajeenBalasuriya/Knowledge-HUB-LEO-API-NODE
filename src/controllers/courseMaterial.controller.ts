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

//delete courseMaterial controller
export const deleteCourseMaterial = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseMaterialId = parseInt(req.params.id);
    const courseMaterialToDelete = await courseMaterialService.getCourseMaterialById(courseMaterialId);
    const deletedCourseMaterial = await courseMaterialService.deleteCourseMaterial(courseMaterialId);

    if (!deletedCourseMaterial) {
      res.status(404).json({
        status: "error",
        message: "Course material not found",
        error: {
          code: "COURSE_MATERIAL_NOT_FOUND",
          details: `No course material found with id ${courseMaterialId}`,
        },
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Course material deleted successfully",
      data: {
        courseMaterialToDelete
      },
    });
  } catch (err) {
    next(err);
  }
};
