import express from "express";

import {
  getCartByUser,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "../Controllers/cartController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, authorize("buyer", "admin"), getCartByUser);

router.post("/:userId/items", protect, authorize("buyer"), addItemToCart);

router.delete("/:userId/items/:productId", protect, authorize("buyer"), removeItemFromCart);

router.delete("/:userId", protect, authorize("buyer"), clearCart);

export default router;