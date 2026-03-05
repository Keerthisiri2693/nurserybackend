const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const Product = require("../models/product"); // ✅ ADD THIS

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

/* ================= GET SELLER PRODUCTS ================= */
router.get("/my-products", auth, getSellerProducts);

/* ================= GET SINGLE PRODUCT ================= */
router.get("/single/:id", auth, getSingleProduct);

router.delete("/delete/:id", auth, deleteProduct);

router.get("/getAllProducts", getAllProducts);

router.put(
  "/update/:id",
  auth,
  upload.array("images", 5),
  updateProduct
);

/* ================= LOW STOCK PRODUCTS ================= */
router.get("/low-stock", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // ✅ Low stock condition (safe version)
    filter.stock = { $lte: 5 };

    // ✅ Category filter
    if (category) {
      filter.category = category;
    }

    // ✅ Search filter
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ stock: 1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;