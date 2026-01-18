import type { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
/**
 * Handle errors
 * @param error - The error to handle
 * @param request - The request object
 * @param response - The response object
 * @param next - The next function
 */
export const errorHandler = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return response.status(400).json({
      error: {
        status: 400,
        message: "Validation failed",
        details,
      },
    });
  }

  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  response.status(status).json({
    error: {
      status: status,
      message,
    },
  });
};
