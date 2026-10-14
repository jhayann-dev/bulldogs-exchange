import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt needed
  }
);

// Part 8: indexes for frequently searched fields

reviewSchema.index({ product: 1 });

reviewSchema.index({ user: 1 });

// prevent a user from reviewing the same product more than once

reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;