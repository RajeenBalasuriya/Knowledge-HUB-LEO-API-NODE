import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({
        status: "error",
        message: "Email is required",
        error: {
          code: "EMAIL_REQUIRED",
          details: "please check email availability",
        },
      });

      return;
    }

    const result = await authService.login(email, password);

    if (!result) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or Password",
        error: {
          code: "INVALID_EMAIL OR INVALID_PASSWORD",
          details: {
            email: req.body.email || null,
            password:req.body.password||null
          },
        },
      });
      return;
    }

    const { token, user } = result;

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        meta: null,
      },
    });
    return;
  } catch (err) {
    next(err);
  }
};
