import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../config/constants.js";

const isOwnerOrAdmin = (req) => {
  return req.user.role === "admin" || req.user.id === req.params.id;
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(HttpStatus.OK).json(users);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only view your own profile",
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(HttpStatus.CREATED).json(userResponse);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "User account is inactive",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(HttpStatus.OK).json({
      message: "Login successful",
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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only update your own profile",
      });
    }

    const { role, password, ...safeUpdates } = req.body;
    const updates = req.user.role === "admin" ? req.body : safeUpdates;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HttpStatus.OK).json(updatedUser);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only change your own password",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Current and new password are required",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(HttpStatus.OK).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};