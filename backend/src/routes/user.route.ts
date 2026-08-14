import express from "express";
import {
  activateUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  markLessonComplete,
  registrationUser,
  resetPassword,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getUserAnalytics } from "../controllers/analytics.controller";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import {
  activationRules,
  forgotPasswordRules,
  loginRules,
  registrationRules,
  resetPasswordRules,
  socialAuthRules,
  updatePasswordRules,
  updateUserInfoRules,
} from "../middleware/validators";

const userRouter = express.Router();

userRouter.post(
  "/registration",
  authLimiter,
  validate(registrationRules),
  registrationUser
);
userRouter.post(
  "/activate-user",
  authLimiter,
  validate(activationRules),
  activateUser
);
userRouter.post("/login", authLimiter, validate(loginRules), loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post(
  "/social-auth",
  authLimiter,
  validate(socialAuthRules),
  socialAuth
);
userRouter.put(
  "/update-user-info",
  isAuthenticated,
  validate(updateUserInfoRules),
  updateUserInfo
);
userRouter.put(
  "/update-user-password",
  isAuthenticated,
  validate(updatePasswordRules),
  updatePassword
);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.put("/course-progress", isAuthenticated, markLessonComplete);

userRouter.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordRules),
  forgotPassword
);
userRouter.put(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordRules),
  resetPassword
);

userRouter.get(
  "/admin/users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/admin/update-user-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/admin/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

userRouter.get(
  "/admin/user-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics
);

export default userRouter;
