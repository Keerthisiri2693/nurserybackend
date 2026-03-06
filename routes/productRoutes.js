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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add new product
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post(
  "/add",
  auth,
  upload.array("images", 5),
  addProduct
);

/**
 * @swagger
 * /api/products/my-products:
 *   get:
 *     summary: Get seller products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Seller products fetched
 */
router.get("/my-products", auth, getSellerProducts);

/**
 * @swagger
 * /api/products/single/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched
 */
router.get("/single/:id", auth, getSingleProduct);

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete("/delete/:id", auth, deleteProduct);

/**
 * @swagger
 * /api/products/getAllProducts:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: All products fetched
 */
router.get("/getAllProducts", getAllProducts);

/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  "/update/:id",
  auth,
  upload.array("images", 5),
  updateProduct
);

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Get low stock products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Low stock products fetched
 */
router.get("/low-stock", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};
    filter.stock = { $lte: 5 };

    if (category) {
      filter.category = category;
    }

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