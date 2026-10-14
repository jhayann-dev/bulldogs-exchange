import Product from "../Models/productModel.js";
import Category from "../Models/categoryModel.js";
import User from "../Models/userModel.js";
import { HttpStatus } from "../config/constants.js";
import cloudinary from "../config/cloudinary.js";

const uploadImageToCloudinary = async (file) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: "bulldogs-exchange/products",
    resource_type: "image",
  });
};

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

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

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
  if (!req.file) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "A product image is required.",
    });
  }

  try {
    const productData = { ...req.body };
    delete productData.images;
    delete productData.imagePublicIds;

    const uploadedImage = await uploadImageToCloudinary(req.file);
    productData.images = [uploadedImage.secure_url];
    productData.imagePublicIds = [uploadedImage.public_id];

    const newProduct = await Product.create(productData);

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

export const uploadProductImage = async (req, res) => {
  if (!req.file) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "An image file is required.",
    });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    // Multer uses memory storage, so upload the file buffer as a data URI.
    const result = await uploadImageToCloudinary(req.file);

    product.images.push(result.secure_url);
    product.imagePublicIds.push(result.public_id);
    await product.save();

    return res.status(HttpStatus.OK).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      product,
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.images;
    delete updateData.imagePublicIds;

    if (req.file) {
      const uploadedImage = await uploadImageToCloudinary(req.file);
      updateData.images = [uploadedImage.secure_url];
      updateData.imagePublicIds = [uploadedImage.public_id];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
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
