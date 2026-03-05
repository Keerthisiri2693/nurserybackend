const express = require("express");
const router = express.Router();
const { getSellerEarnings } = require("../controllers/earningController");
const auth = require("../middleware/auth");

router.get("/seller", auth, getSellerEarnings);

module.exports = router;