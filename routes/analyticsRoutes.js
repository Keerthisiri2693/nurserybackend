const express = require("express");
const { getSellerAnalytics } = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/seller", auth, getSellerAnalytics);

module.exports = router;