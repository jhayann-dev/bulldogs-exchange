import User from "../Models/userModel.js";
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

    res.status(HttpStatus.CREATED).json(newUser);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
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

    // Prevent non-admins from changing role or password through this route
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
    await user.save(); // triggers pre("save") hashing hook

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