import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { ISection } from "../interfaces/ISection.interface";
import { SectionService } from "../services/section.service";

const sectionService = new SectionService();

export const createSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
 
  const sectionData: ISection=req.body;

  try {
    const createdSection = await sectionService.createSection(sectionData);

    res.status(201).json({
      status: "success",
      message: "Section created successfully",
      data: {
        createdSection,
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

//update section
// export const updateSection = async (
//   req: AuthRequest<{ id: string }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user: IJwtUser = req.user;
//   const sectionId = parseInt(req.params.id);
//   const sectionData: ISection = req.body;

//   try {
//     const updatedSection = await sectionService.updateSection({
//       userId: user.id,
//       sectionId,
//       title: sectionData.title,
//       content: sectionData.content,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Section updated successfully",
//       data: {
//         updatedSection,
//         meta: null,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteSection = async (
//   req: AuthRequest<{ id: string }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user: IJwtUser = req.user;
//     const sectionId = parseInt(req.params.id);

//     const deletedSection = await sectionService.deleteSection({
//       userId: user.id,
//       sectionId,
//     });

//     if (!deletedSection) {
//       res.status(404).json({
//         status: "error",
//         message: "Section not found or you do not have permission to delete it",
//         error: {
//           code: "SECTION_NOT_FOUND",
//           details: `No section found with id ${sectionId}`,
//         },
//       });
//       return;
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Section deleted successfully",
//       data: {
//         deletedSection,
//         meta: null,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Update section completed status
export const updateSectionCompleted = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = parseInt(req.params.id);
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      res.status(400).json({
        status: "error",
        message: "'completed' field must be boolean."
      });
      return;
    }
    const section = await sectionService.updateSectionCompleted(sectionId, completed);
    res.status(200).json({
      status: "success",
      message: "Section completion status updated successfully",
      data: section,
    });
  } catch (err) {
    next(err);
  }
};
