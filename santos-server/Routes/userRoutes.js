import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../Controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);

router.get("/:id", protect, getUserById);

router.post("/", createUser);

router.put("/:id", protect, updateUser);

router.put("/:id/change-password", protect, changePassword);

router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;