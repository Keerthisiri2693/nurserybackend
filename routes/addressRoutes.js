const express = require("express");
const router = express.Router();

const {
  addAddress,
  getUserAddresses,
  deleteAddress,
} = require("../controllers/addressController");

router.post("/add", addAddress);
router.get("/:userId", getUserAddresses);
router.delete("/:addressId", deleteAddress);

module.exports = router;