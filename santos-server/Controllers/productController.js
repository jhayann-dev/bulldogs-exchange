import Product from "../Models/productModel.js";
import Category from "../Models/categoryModel.js";
import User from "../Models/userModel.js";
import { HttpStatus } from "../config/constants.js";

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      supplier,
      search,
      sort,
    } = req.query;

    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.max(parseInt(limit) || 10, 1);
    const skip = (currentPage - 1) * itemsPerPage;

    const filter = {};

    // Filter by category
    if (category) {
      const matchedCategory = await Category.findOne({
        categoryName: { $regex: `^${category}$`, $options: "i" },
      });

      if (!matchedCategory) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: "Products retrieved successfully.",
          count: 0,
          data: [],
          pagination: {
            currentPage,
            itemsPerPage,
            totalProducts: 0,
            totalPages: 0,
          },
        });
      }

      filter.category = matchedCategory._id;
    }

    // Filter by supplier (the seller/user who listed the product)
    if (supplier) {
      const matchedSellers = await User.find({
        $or: [
          { firstName: { $regex: supplier, $options: "i" } },
          { lastName: { $regex: supplier, $options: "i" } },
        ],
      }).select("_id");

      if (matchedSellers.length === 0) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: "Products retrieved successfully.",
          count: 0,
          data: [],
          pagination: {
            currentPage,
            itemsPerPage,
            totalProducts: 0,
            totalPages: 0,
          },
        });
      }

      filter.seller = { $in: matchedSellers.map((s) => s._id) };
    }

    // Keyword search across productName and description
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort) {
      const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
      const sortDirection = sort.startsWith("-") ? -1 : 1;
      sortOption[sortField] = sortDirection;
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "categoryName")
      .populate("seller", "firstName lastName email")
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Products retrieved successfully.",
      count: products.length,
      data: products,
      pagination: {
        currentPage,
        itemsPerPage,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "categoryName")
      .populate("seller", "firstName lastName email");

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product retrieved successfully.",
      data: product,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product deleted successfully.",
      data: null,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};