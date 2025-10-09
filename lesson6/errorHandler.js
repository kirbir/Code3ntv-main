import { NextFunction, Response } from "express";

export const errorHandler = (
    error,
    response,
    next,
  ) => {
    console.error('errorHandler', error);
    response.status(error.status ||500).json({ success:false, error:error || 'Internal Server error'});
  };
