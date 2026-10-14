import express from "express";

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../Controllers/orderController.js";
import { protect, authorize } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", protect, authorize("buyer", "admin"), getAllOrders);

router.get("/:id", protect, getOrderById);

router.post("/", protect, authorize("buyer"), createOrder);

router.put("/:id", protect, authorize("buyer", "admin"), updateOrder);

router.delete("/:id", protect, authorize("admin"), deleteOrder);

export default router;