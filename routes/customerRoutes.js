const express = require("express");
const router = express.Router();
const { registerCustomer,verifyOtp,login } = require("../controllers/customerController");



const { resendOtp } = require("../controllers/customerController");

router.post("/resend-otp", resendOtp);

router.post("/verify-otp", verifyOtp);




router.post("/register",registerCustomer);

router.post("/login",login);


module.exports = router;