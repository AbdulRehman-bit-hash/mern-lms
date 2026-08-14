import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  addAnswerRules,
  addQuestionRules,
  addReviewRules,
} from "../middleware/validators";
import {
  addAnswer,
  addQuestion,
  addReview,
  deleteCourse,
  editCourse,
  getAdminAllCourses,
  getAllCourses,
  getCourseAnalytics,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
  "/get-course-content/:id",
  isAuthenticated,
  getCourseByUser
);

courseRouter.put(
  "/add-question",
  isAuthenticated,
  validate(addQuestionRules),
  addQuestion
);
courseRouter.put(
  "/add-answer",
  isAuthenticated,
  validate(addAnswerRules),
  addAnswer
);
courseRouter.put(
  "/add-review/:id",
  isAuthenticated,
  validate(addReviewRules),
  addReview
);

courseRouter.get(
  "/admin/get-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

courseRouter.delete(
  "/admin/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

courseRouter.get(
  "/admin/course-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCourseAnalytics
);

export default courseRouter;
