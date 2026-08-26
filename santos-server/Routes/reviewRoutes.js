import express from "express";

import {
  getAllReviews,
  getReviewsByProduct,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../Controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllReviews);

router.get("/product/:productId", getReviewsByProduct);

router.get("/:id", getReviewById);

router.post("/", protect, authorize("buyer"), createReview);

router.put("/:id", protect, authorize("admin"), updateReview);

router.delete("/:id", protect, authorize("admin"), deleteReview);

export default router;