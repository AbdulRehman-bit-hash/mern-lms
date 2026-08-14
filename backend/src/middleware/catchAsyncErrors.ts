import { NextFunction, Request, Response } from "express";

export const CatchAsyncError =
  (theFunc: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
