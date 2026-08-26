import Order from "../Models/orderModel.js";
import { HttpStatus } from "../config/constants.js";

export const getAllOrders = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "admin") {
      if (req.query.user) {
        filter.user = req.query.user;
      }
    } else {
      filter.user = req.user.id;
    }

    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .populate("items.product", "productName price images")
      .sort({ createdAt: -1 });

    res.status(HttpStatus.OK).json(orders);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "productName price images");

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "Not your order",
      });
    }

    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(HttpStatus.CREATED).json(newOrder);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "Not your order",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(HttpStatus.OK).json(updatedOrder);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};