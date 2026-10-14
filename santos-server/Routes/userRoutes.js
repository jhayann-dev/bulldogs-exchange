import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../Controllers/userController.js";

import { protect, authorize } from "../middleware/authentication.js";
import { registerValidation, loginValidation } from "../middleware/validationMiddleware.js";
import { loginLimiter, registerLimiter, loginLockout } from "../middleware/rateLimiterMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);

router.get("/:id", protect, getUserById);

router.post("/", registerLimiter, registerValidation, createUser);

router.post("/login", loginLimiter, loginValidation, loginLockout, loginUser);

router.put("/:id", protect, updateUser);

router.put("/:id/change-password", protect, changePassword);

router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;