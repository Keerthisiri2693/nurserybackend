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

    const imagePaths = req.files?.map(file => file.path) || [];

    const product = await Product.create({
      seller: req.user.id,
      ...req.body,
      images: imagePaths,
      status: req.body.status || "Active",
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
      message: "Server Error",
    });
  }
};

/* ================= GET SELLER PRODUCTS ================= */

exports.getSellerProducts = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const products = await Product.find({
      seller: req.user.id,
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
      message: "Server Error",
    });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

exports.getSingleProduct = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(id);

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
      message: "Server Error",
    });
  }
};

/* ================= DELETE PRODUCT ================= */

exports.deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findOneAndDelete({
      _id: id,
      seller: req.user.id,
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
      message: "Server Error",
    });
  }
};

/* ================= UPDATE PRODUCT ================= */

exports.updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findOne({
      _id: id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    const newImages = req.files?.map(file => file.path);

    Object.assign(product, {
      ...req.body,
      images: newImages?.length ? newImages : product.images,
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
      message: "Server Error",
    });
  }
};

/* ================= GET ALL PRODUCTS ================= */

exports.getAllProducts = async (req, res) => {
  try {

    const { categoryName } = req.query;

    let filter = {};

    if (categoryName) {
      filter.categoryName = new RegExp(`^${categoryName}$`, "i");
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
      message: "Server Error",
    });
  }
};