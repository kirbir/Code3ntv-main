import { NextFunction, Response } from "express";

export const errorHandler = (
    error: { status: any; },
    response: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: { success: boolean; error: any; }): void; new(): any; }; }; },
    next: any,
  ) => {
    console.error('errorHandler', error);
    response.status(error.status ||500).json({ success:false, error:error || 'Internal Server error'});
  };
