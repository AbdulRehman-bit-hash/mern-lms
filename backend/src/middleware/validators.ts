import { body, param } from "express-validator";

// ------------------- Auth -------------------

export const registrationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters"),
];

export const loginRules = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const activationRules = [
  body("activation_token").notEmpty().withMessage("Activation token is required"),
  body("activation_code")
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage("Activation code must be 4 digits")
    .isNumeric()
    .withMessage("Activation code must be numeric"),
];

export const socialAuthRules = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

export const updateUserInfoRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

export const updatePasswordRules = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6, max: 128 })
    .withMessage("New password must be between 6 and 128 characters"),
];

export const forgotPasswordRules = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
];

export const resetPasswordRules = [
  param("token")
    .trim()
    .isLength({ min: 32, max: 128 })
    .withMessage("Invalid reset token"),
  body("newPassword")
    .isLength({ min: 6, max: 128 })
    .withMessage("New password must be between 6 and 128 characters"),
];

// ------------------- Course content: questions, answers, reviews -------------------

export const addQuestionRules = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question cannot be empty")
    .isLength({ max: 2000 })
    .withMessage("Question is too long (max 2000 characters)"),
  body("courseId").isMongoId().withMessage("Invalid course id"),
  body("contentId").isMongoId().withMessage("Invalid content id"),
];

export const addAnswerRules = [
  body("answer")
    .trim()
    .notEmpty()
    .withMessage("Answer cannot be empty")
    .isLength({ max: 2000 })
    .withMessage("Answer is too long (max 2000 characters)"),
  body("courseId").isMongoId().withMessage("Invalid course id"),
  body("contentId").isMongoId().withMessage("Invalid content id"),
  body("questionId").isMongoId().withMessage("Invalid question id"),
];

export const addReviewRules = [
  param("id").isMongoId().withMessage("Invalid course id"),
  body("review")
    .trim()
    .notEmpty()
    .withMessage("Review cannot be empty")
    .isLength({ max: 2000 })
    .withMessage("Review is too long (max 2000 characters)"),
  body("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

// ------------------- Orders -------------------

export const createOrderRules = [
  body("courseId").isMongoId().withMessage("Invalid course id"),
];
