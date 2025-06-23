import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";

export const checkRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
)=>{
  try {
    const user: IJwtUser = req.user;

    if (user.role !== "admin") {
      res.status(403).json({
        status: "error",
        message: "You need admin role to perform this action",
        error: {
          code: "NOT_ALLOWED_ACTION",
          details: {
            role: user.role,
          },
        },
      });
      return; // Stop further middleware execution
    }

    next(); 
  } catch (err) {
    next(err);
  }
};
