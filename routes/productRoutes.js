const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const Product = require("../models/product");

const {
  addProduct,
  getSellerProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  getAllProducts
} = require("../controllers/productController");

/* ================= ADD PRODUCT ================= */

router.post(
  "/add",
  auth,
  upload.array("images", 5),
  addProduct
);

/* ================= SELLER PRODUCTS ================= */

router.get("/my-products", auth, getSellerProducts);

/* ================= SINGLE PRODUCT ================= */

router.get("/single/:id", auth, getSingleProduct);

/* ================= DELETE PRODUCT ================= */

router.delete("/delete/:id", auth, deleteProduct);

/* ================= UPDATE PRODUCT ================= */

router.put(
  "/update/:id",
  auth,
  upload.array("images", 5),
  updateProduct
);

/* ================= ALL PRODUCTS (PUBLIC) ================= */

router.get("/getAllProducts", getAllProducts);

/* ================= LOW STOCK PRODUCTS ================= */

router.get("/low-stock", auth, async (req, res) => {
  try {

    const { category, search } = req.query;

    let filter = {
      stock: { $lte: 5 }
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

    console.error("Low Stock Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});

module.exports = router;