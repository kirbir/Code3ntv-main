import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  status: number;
  statusCode?: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}


import z from 'zod';

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return response.status(400).json({
      success: false,
      error: 'Validation failed',
      details,
    });
  }

  // Handle regular errors
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  response.status(status).json({
    error: {
      status: status,
      message: message,
    }
  });

};

