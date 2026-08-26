import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

categorySchema.index({ categoryName: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;