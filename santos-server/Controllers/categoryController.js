import Category from "../Models/categoryModel.js";
import { HttpStatus } from "../config/constants.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(HttpStatus.OK).json(categories);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    res.status(HttpStatus.OK).json(category);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(HttpStatus.CREATED).json(newCategory);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    res.status(HttpStatus.OK).json(updatedCategory);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};