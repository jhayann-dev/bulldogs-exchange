import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import { HttpStatus } from "../config/constants.js";

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Email already in use",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role === "admin" ? "buyer" : role,
    });

    const token = signToken(user);

    res.status(HttpStatus.CREATED).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "This account has been deactivated. Please contact support.",
      });
    }

    const token = signToken(user);

    res.status(HttpStatus.OK).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};