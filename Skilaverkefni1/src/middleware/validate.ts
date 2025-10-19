import { Request, Response, NextFunction } from 'express';
import z, { ZodSchema, ZodError } from 'zod';

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
 * Validate the request body
 * @param schema - The Zod schema to validate the request body against
 * @returns A middleware function that validates the request body
 */

  
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
  