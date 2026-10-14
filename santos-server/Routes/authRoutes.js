import express from "express";
import { register, login } from "../Controllers/authController.js";
import { registerValidation, loginValidation } from "../middleware/validationMiddleware.js";
import { loginLimiter, registerLimiter, loginLockout } from "../middleware/rateLimiterMiddleware.js";

const router = express.Router();

router.post("/register", registerLimiter, registerValidation, register);
router.post("/login", loginLimiter, loginValidation, loginLockout, login);

export default router;
