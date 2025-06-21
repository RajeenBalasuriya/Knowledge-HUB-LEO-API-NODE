import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { LoginUserDto } from "../DTOs/auth-login.dto";
import { validateDto } from "../middlewares/validateDto";

const authRouter = Router();

authRouter.post("/login",validateDto(LoginUserDto),login);

export default authRouter;
