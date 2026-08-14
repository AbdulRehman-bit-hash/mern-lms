import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import ErrorHandler from "../utils/ErrorHandler";

// Wraps an array of express-validator rules: runs each, and if any failed,
// short-circuits with a 400 using the first validation message rather than
// letting bad input reach a controller (and from there, the database).
export const validate = (rules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 400));
    }

    next();
  };
};
