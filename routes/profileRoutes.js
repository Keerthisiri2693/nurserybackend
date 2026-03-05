const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.post("/create",createProfile);

router.get("/", getProfile);
router.put("/update", updateProfile);

module.exports = router;