import mongoose from "mongoose";

// Embedded sub-document -> Part 4 (locks in price/qty at time of checkout)

const orderItemSchema = new mongoose.Schema(
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
    },

    priceAtAddition: {
      type: Number,
      required: true,
    },
  },

  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referenced Document -> Part 4
      required: true,
    },

    items: {
      type: [orderItemSchema], // Embedded Documents -> Part 4
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },

  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Part 8: indexes for frequently searched fields

orderSchema.index({ user: 1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ paymentStatus: 1 });

orderSchema.index({ createdAt: -1 }); // recent orders first

const Order = mongoose.model("Order", orderSchema);

export default Order;