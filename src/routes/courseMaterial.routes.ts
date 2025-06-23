import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";
import { validateDto } from "../middlewares/validateDto";
import { CreateCourseMaterialDto } from "../DTOs/create-courseMaterial.dto";
import { createCourseMaterial, deleteCourseMaterial } from "../controllers/courseMaterial.controller";


const courseMaterialRouter = Router();

courseMaterialRouter.post('/', authenticateMiddleware, checkRoleMiddleware, validateDto(CreateCourseMaterialDto), createCourseMaterial);
courseMaterialRouter.delete('/:id', authenticateMiddleware, checkRoleMiddleware, deleteCourseMaterial);

export default courseMaterialRouter;