import jwt from "jsonwebtoken";
import { HttpStatus } from "../config/constants.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: "Not authorized, no token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      message: "Not authorized, invalid token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};