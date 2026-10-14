import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("firstName")
    .isString().withMessage("First name must be a string")
    .isLength({ min: 2 }).withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .isString().withMessage("Last name must be a string")
    .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long"),
  body("email")
    .isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["Customer", "admin"]).withMessage("Role must be either Customer or admin"),
  body("contactNumber")
    .optional()
    .isNumeric().withMessage("Contact number must be a number"),
  body("address")
    .optional()
    .isString().withMessage("Address must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Invalid email address"),
  body("password")
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
