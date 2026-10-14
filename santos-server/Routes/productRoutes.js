import express from "express";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../Controllers/productController.js";
import { protect, authorize } from "../middleware/authentication.js";
import uploadImageMiddleware from "../middleware/uploadImageMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post(
  "/:id/upload-image",
  protect,
  authorize("admin"),
  uploadImageMiddleware,
  uploadProductImage
);

router.post("/", protect, authorize("admin"), uploadImageMiddleware, createProduct);

router.put("/:id", protect, authorize("admin"), uploadImageMiddleware, updateProduct);

router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
