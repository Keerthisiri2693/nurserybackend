const express = require("express");
const { getLowStockProducts } = require("../controllers/inventoryController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/low-stock", auth, getLowStockProducts);

module.exports = router;