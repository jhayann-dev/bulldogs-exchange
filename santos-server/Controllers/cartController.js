import Cart from "../Models/cartModel.js";
import { HttpStatus } from "../config/constants.js";

const recalcTotal = (cart) => {
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.priceAtAddition * item.quantity,
    0
  );
};

const isOwnerOrAdmin = (req) => {
  return req.user.role === "admin" || req.user.id === req.params.userId;
};

export const getCartByUser = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only view your own cart",
      });
    }

    const cart = await Cart.findOne({
      user: req.params.userId,
    }).populate("items.product", "productName price images");

    if (!cart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only modify your own cart",
      });
    }

    const { product, quantity, priceAtAddition } = req.body;

    let cart = await Cart.findOne({
      user: req.params.userId,
    });

    if (!cart) {
      cart = new Cart({
        user: req.params.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === product
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product,
        quantity: quantity || 1,
        priceAtAddition,
      });
    }

    recalcTotal(cart);

    await cart.save();

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only modify your own cart",
      });
    }

    const cart = await Cart.findOne({
      user: req.params.userId,
    });

    if (!cart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    recalcTotal(cart);

    await cart.save();

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only modify your own cart",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: req.params.userId,
      },
      {
        items: [],
        totalPrice: 0,
      },
      {
        new: true,
      }
    );

    if (!cart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};