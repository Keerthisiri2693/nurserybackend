const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const {
  createOrder,
  getSellerOrders,
  getSingleOrder,
  updateOrderStatus,
  getMyOrders,getCustomerSingleOrder // 👈 add this
} = require("../controllers/orderController");

/* Customer places order */
router.post("/create",auth, createOrder);

/* Customer my orders */
router.get("/my-orders", auth, getMyOrders);

/* Single order (customer & seller) */
router.get("/single/:id", auth, getSingleOrder);

/* Seller only */
router.get("/seller-orders", auth,getSellerOrders);
router.put("/update/:id", auth, updateOrderStatus);
router.get("/customer/single/:id",auth,getCustomerSingleOrder);

module.exports = router;