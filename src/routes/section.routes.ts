import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { createSection, updateSectionCompleted } from "../controllers/section.controller";
import { checkRoleMiddleware } from "../middlewares/checkRole";
import { validateDto } from "../middlewares/validateDto";
import { createSectionDto } from "../DTOs/create-section.dto";

const sectionRouter = Router();

sectionRouter.post("/",authenticateMiddleware,validateDto(createSectionDto),checkRoleMiddleware,createSection);
sectionRouter.put("/:id/completed", authenticateMiddleware, updateSectionCompleted);

export default sectionRouter;