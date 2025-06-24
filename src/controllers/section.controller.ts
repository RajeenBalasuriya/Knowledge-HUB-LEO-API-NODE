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
