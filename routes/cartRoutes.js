const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/product");
const auth = require("../middleware/auth");

/* ================= ADD / UPDATE CART ================= */

router.post("/add", auth, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Always from token
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid cart data",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += quantity;

      // Remove if quantity becomes 0 or less
      if (existingItem.quantity <= 0) {
        await Cart.deleteOne({ _id: existingItem._id });
        return res.json({
          success: true,
          message: "Item removed from cart",
        });
      }

      existingItem.price = product.price;
      existingItem.totalPrice =
        existingItem.quantity * product.price;

      await existingItem.save();

      return res.json({
        success: true,
        message: "Cart updated",
        cartItem: existingItem,
      });
    }

    // Create new cart item
    const newItem = new Cart({
      userId,
      productId,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity,
    });

    await newItem.save();

    res.json({
      success: true,
      message: "Added to cart",
      cartItem: newItem,
    });

  } catch (error) {
    console.log("Cart Add Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= GET USER CART ================= */

router.get("/my-cart", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    console.error("Cart Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= REMOVE ITEM ================= */

router.delete("/remove/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await Cart.deleteOne({ userId, productId });

    res.json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {
    console.error("Cart Remove Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= CLEAR CART ================= */

router.delete("/clear", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {
    console.error("Cart Clear Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;