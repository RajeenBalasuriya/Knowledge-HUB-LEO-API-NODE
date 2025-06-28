import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";
import { validateDto } from "../middlewares/validateDto";
import { CreateUserCoursesDto } from "../DTOs/create-userCourses.dto";
import { UpdateUserCoursesDto } from "../DTOs/update-userCourses.dto";
import {
  enrollUserInCourse,
  getUserEnrollments,
  getEnrollment,
  updateEnrollment,
  unenrollUserFromCourse,
  getCourseEnrollments,
} from "../controllers/userCourses.controller";

const userCoursesRouter = Router();

userCoursesRouter.post("/enroll", authenticateMiddleware, validateDto(CreateUserCoursesDto), enrollUserInCourse);
userCoursesRouter.get("/my-enrollments", authenticateMiddleware, getUserEnrollments);
userCoursesRouter.get("/enrollment/:courseId", authenticateMiddleware, getEnrollment);
userCoursesRouter.put("/enrollment/:courseId", authenticateMiddleware, validateDto(UpdateUserCoursesDto), updateEnrollment);
userCoursesRouter.delete("/unenroll/:courseId", authenticateMiddleware, unenrollUserFromCourse);
userCoursesRouter.get("/course/:courseId/enrollments", authenticateMiddleware, checkRoleMiddleware, getCourseEnrollments);

export default userCoursesRouter; 