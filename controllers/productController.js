const mongoose = require("mongoose");
const Product = require("../models/product");

/* ================= ADD PRODUCT ================= */

exports.addProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      name,
      sku,
      category,
      categoryName,
      section,
      subcategory,
      price,
      mrp,
      stock,
      lowStockLimit,
      light,
      watering,
      height,
      description,
      about,
      growing,
      care,
      uses,
      funFacts,
      status,
    } = req.body;

    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    const product = await Product.create({
      seller: req.user.id,
      name,
      sku,
      category,
      categoryName,
      section,
      subcategory,
      price,
      mrp,
      stock,
      lowStockLimit,
      images: imagePaths,
      light,
      watering,
      height,
      description,
      about,
      growing,
      care,
      uses,
      funFacts,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SELLER PRODUCTS ================= */

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id, // FIXED (use req.user.id)
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.log("Get Seller Products Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

exports.getSingleProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.log("Single Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE PRODUCT ================= */

exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id, // FIXED
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.log("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */

exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id, // FIXED
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    const updatedImages = req.files?.length
      ? req.files.map((file) => file.path)
      : product.images;

    Object.assign(product, {
      ...req.body,
      images: updatedImages,
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL PRODUCTS (PUBLIC) ================= */

exports.getAllProducts = async (req, res) => {
  try {
    const { categoryName } = req.query;

    let filter = {}; // remove status filter

    if (categoryName) {
      filter.categoryName = {
        $regex: new RegExp(`^${categoryName}$`, "i"),
      };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.log("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};