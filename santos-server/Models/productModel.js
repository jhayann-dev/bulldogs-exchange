import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },

    images: {
      type: [String], 
      default: [],
    },

    imagePublicIds: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "used",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referenced Document -> Part 4
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
  },

  {
    timestamps: true, 
  }
);


productSchema.index({
  productName: "text",
  description: "text",
}); 

productSchema.index({ category: 1 });

productSchema.index({ seller: 1 });

productSchema.index({ status: 1 });

productSchema.index({ price: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
