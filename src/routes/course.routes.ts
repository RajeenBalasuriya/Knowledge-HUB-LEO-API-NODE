import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";


import { createCourse, deleteCourse, readAllCourse, readCourseById, searchCourseByName, updateCourse, rateCourse, getCourseRatingStats } from "../controllers/course.controller";
import { validateDto } from "../middlewares/validateDto";
import { CreateCourseDto } from "../DTOs/create-course.dto";
import { RateCourseDto } from "../DTOs/rate-course.dto";

const courseRouter =  Router();


courseRouter.post('/',authenticateMiddleware,checkRoleMiddleware,validateDto(CreateCourseDto),createCourse)
courseRouter.get('/', authenticateMiddleware, readAllCourse);
courseRouter.get('/search-by-name', authenticateMiddleware, searchCourseByName);
courseRouter.get('/:id', authenticateMiddleware, readCourseById);
courseRouter.put('/:id', authenticateMiddleware, checkRoleMiddleware, updateCourse);
courseRouter.delete('/:id', authenticateMiddleware, checkRoleMiddleware, deleteCourse); 

// Rating routes (no admin required, only enrollment check)
courseRouter.post('/rate', authenticateMiddleware, validateDto(RateCourseDto), rateCourse);
courseRouter.get('/:id/rating-stats', authenticateMiddleware, getCourseRatingStats);

export default courseRouter;