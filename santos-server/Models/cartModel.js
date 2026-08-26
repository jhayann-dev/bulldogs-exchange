import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    priceAtAddition: {
      type: Number,
      required: true,
    },
  },

  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

cartSchema.index({ user: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;