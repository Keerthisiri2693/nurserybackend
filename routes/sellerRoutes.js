const express = require("express");
const router = express.Router();
const { registerSeller, verifyOtp, login } = require("../controllers/sellerController");
const upload = require("../middleware/upload");

const { resendOtp } = require("../controllers/sellerController");

router.post("/resend-otp", resendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/register", upload.single("logo"), registerSeller);

// ✅ Login (NO multer here)
router.post("/login", login);

module.exports = router;