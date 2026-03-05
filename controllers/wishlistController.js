const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/product"); // make sure case matches file name

/* ================= ADD TO WISHLIST ================= */

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existing = await Wishlist.findOne({ userId, productId });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already in wishlist",
      });
    }

    await Wishlist.create({
      userId,
      productId,
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });

  } catch (error) {
    console.log("Add Wishlist Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET MY WISHLIST ================= */

exports.getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        select: "name price mrp images stock categoryName",
      })
      .sort({ createdAt: -1 });

    // Remove invalid/deleted products
    const validWishlist = wishlist.filter(
      (item) => item.productId !== null
    );

    res.status(200).json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist,
    });

  } catch (error) {
    console.log("Get Wishlist Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REMOVE FROM WISHLIST ================= */

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const removed = await Wishlist.findOneAndDelete({
      userId,
      productId,
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });

  } catch (error) {
    console.log("Remove Wishlist Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};