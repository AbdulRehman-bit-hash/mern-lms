import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import { generateLast12MonthsData } from "../utils/analyticsGenerator";

// ------------------- Admin: user analytics (last 12 months signups) -------------------

export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);
      res.status(200).json({ success: true, users });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
