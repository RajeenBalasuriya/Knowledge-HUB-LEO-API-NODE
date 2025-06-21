import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log error details

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || null,
    },
  });
};
