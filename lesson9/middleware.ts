import { NextFunction, Request, Response } from 'express';
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

/**
 * Validate the request body
 * @param schema - The Zod schema to validate the request body against
 * @returns A middleware function that validates the request body
 */
export const validate = (schema: z.ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse(request.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate the request parameters
 * @param schema - The Zod schema to validate the request parameters against
 * @returns A middleware function that validates the request parameters
 */
export const validateParams = (schema: z.ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse(request.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate the query parameters
 * @param schema - The Zod schema to validate the query parameters against
 * @returns A middleware function that validates the query parameters
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const queryData: any = {};

      for (const [key, value] of Object.entries(request.query)) {
        if (value !== undefined) {
          if (typeof value === 'string' && !isNaN(Number(value))) {
            queryData[key] = Number(value);
          } else {
            queryData[key] = value;
          }
        }
      }

      schema.parse(queryData);
      next();
    } catch (error) {
      next(error);
    }
  };
};