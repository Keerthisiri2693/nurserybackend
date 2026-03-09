const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");


/* ================= REGISTER SELLER ================= */

exports.registerSeller = async (req, res) => {
  try {

    const { shopName, email, phone, gst, password } = req.body;
    const logo = req.file ? req.file.path : null;

    if (!shopName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const seller = await Seller.create({
      shopName,
      email,
      phone,
      gst,
      password: hashedPassword,
      logo,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    try {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Seller Account - OTP",
        html: `
          <h2>Hello ${shopName}</h2>
          <p>Your OTP for verification:</p>
          <h1>${otp}</h1>
          <p>Expires in 10 minutes</p>
        `
      });

    } catch (mailError) {

      console.log("EMAIL ERROR:", mailError.message);

    }

    res.status(201).json({
      success: true,
      message: "Seller registered successfully. OTP sent to email",
      email: seller.email
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });

  }
};



/* ================= VERIFY OTP ================= */

exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller not found"
      });
    }

    if (seller.otp !== otp || seller.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    seller.isVerified = true;
    seller.otp = null;
    seller.otpExpiry = null;

    await seller.save();

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token
    });

  } catch (error) {

    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};



/* ================= RESEND OTP ================= */

exports.resendOtp = async (req, res) => {
  try {

    const { email } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller not found"
      });
    }

    if (seller.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified"
      });
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    seller.otp = newOtp;
    seller.otpExpiry = Date.now() + 10 * 60 * 1000;

    await seller.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP - Verify Your Seller Account",
      html: `
        <h2>Hello ${seller.shopName}</h2>
        <p>Your new OTP:</p>
        <h1>${newOtp}</h1>
        <p>This OTP expires in 10 minutes</p>
      `
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (error) {

    console.log("RESEND OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to resend OTP"
    });

  }
};



/* ================= LOGIN SELLER ================= */

exports.login = async (req, res) => {
  try {

    if (!req.body) {
      return res.status(400).json({
        success:false,
        message:"Request body missing"
      });
    }

    const { email, password } = req.body;

    console.log("BODY DATA:", req.body); // debug

    const seller = await Seller.findOne({ email }).select("+password");

    if (!seller) {
      return res.status(400).json({
        success:false,
        message:"Seller not found"
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({
        success:false,
        message:"Incorrect password"
      });
    }

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success:true,
      token,
      seller
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }
};