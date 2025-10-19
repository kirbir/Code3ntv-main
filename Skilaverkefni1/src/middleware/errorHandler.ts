import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}



import z from 'zod';

/**
 * Handle errors
 * @param error - The error to handle
 * @param request - The request object
 * @param response - The response object
 * @param next - The next function
 */
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
    success: false,
    error: message,
  });
};

