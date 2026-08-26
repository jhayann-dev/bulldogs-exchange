import Review from "../Models/reviewModel.js";
import { HttpStatus } from "../config/constants.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "firstName lastName")
      .populate("product", "productName")
      .sort({ createdAt: -1 });

    res.status(HttpStatus.OK).json(reviews);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "firstName lastName profileImage");

    res.status(HttpStatus.OK).json(reviews);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "firstName lastName"
    );

    if (!review) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Review not found",
      });
    }

    res.status(HttpStatus.OK).json(review);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const newReview = await Review.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(HttpStatus.CREATED).json(newReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "You already reviewed this product",
      });
    }

    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Review not found",
      });
    }

    res.status(HttpStatus.OK).json(updatedReview);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Review not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};