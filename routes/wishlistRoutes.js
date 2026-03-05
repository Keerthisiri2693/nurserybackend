const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

/* Add */
router.post("/add", auth, addToWishlist);

/* Get */
router.get("/my-wishlist", auth, getMyWishlist);

/* Remove */
router.delete("/remove/:productId", auth, removeFromWishlist);

module.exports = router;