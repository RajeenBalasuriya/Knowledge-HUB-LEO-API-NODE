import { Request } from "express";

export interface AuthRequest<T = any> extends Request {
  user?: any;
}