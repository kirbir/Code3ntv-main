import type { Request, Response, NextFunction } from "express";
import z, { ZodSchema, ZodError } from "zod";

/**
 * Validate the request body
 * @param schema - The Zod schema to validate the request body against
 * @returns A middleware function that validates the request body
 */
export const validate = (schema: z.ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    (async () => {
      try {
        const parsed = await schema.parseAsync(request.body);
        request.body = parsed;
        next();
      } catch (error) {
        next(error);
      }
    })();
  };
};

/**
 * Validate the request parameters
 * @param schema - The Zod schema to validate the request parameters against
 * @returns A middleware function that validates the request parameters
 */
export const validateParams = (schema: z.ZodSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    (async () => {
      try {
        const parsed = await schema.parseAsync(request.params);
        request.params = parsed;
        next();
      } catch (error) {
        next(error);
      }
    })();
  };
};
