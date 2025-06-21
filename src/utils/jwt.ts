import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import config from "../config/config";

const JWT_SECRET = config.jwt.secret|| "default_secret";
const JWT_EXPIRES_IN = "7d";

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
