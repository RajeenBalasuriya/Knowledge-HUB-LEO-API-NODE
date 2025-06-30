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
  getUserEnrollmentSummary,
  searchUserEnrollments,
} from "../controllers/userCourses.controller";

const userCoursesRouter = Router();

userCoursesRouter.post("/enroll", authenticateMiddleware, validateDto(CreateUserCoursesDto), enrollUserInCourse);


userCoursesRouter.put("/enrollment/:courseId", authenticateMiddleware, validateDto(UpdateUserCoursesDto), updateEnrollment);
userCoursesRouter.delete("/unenroll/:courseId", authenticateMiddleware, unenrollUserFromCourse);
userCoursesRouter.get("/course/:courseId/enrollments", authenticateMiddleware, checkRoleMiddleware, getCourseEnrollments);
userCoursesRouter.get("/my-enrollment-summary", authenticateMiddleware, getUserEnrollmentSummary);
userCoursesRouter.get("/my-enrollments/search", authenticateMiddleware, searchUserEnrollments);
userCoursesRouter.get("/my-enrollments", authenticateMiddleware, getUserEnrollments);
userCoursesRouter.get("/enrollment/:courseId", authenticateMiddleware, getEnrollment);

export default userCoursesRouter; 