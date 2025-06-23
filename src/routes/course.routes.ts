import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";


import { createCourse, readAllCourse, readCourseById } from "../controllers/course.controller";
import { validateDto } from "../middlewares/validateDto";
import { CreateCourseDto } from "../DTOs/create-course.dto";

const courseRouter =  Router();


courseRouter.post('/',authenticateMiddleware,checkRoleMiddleware,validateDto(CreateCourseDto),createCourse)
courseRouter.get('/', authenticateMiddleware, readAllCourse);
courseRouter.get('/:id', authenticateMiddleware, readCourseById);
export default courseRouter;