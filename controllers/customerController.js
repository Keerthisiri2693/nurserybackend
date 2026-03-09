const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");


/* ================= REGISTER CUSTOMER ================= */

exports.registerCustomer = async (req, res) => {
  try {

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const customer = await Customer.create({
      fullname,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Customer Account - OTP",
      html: `
        <h2>Hello ${fullname}</h2>
        <p>Your OTP for account verification is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      `
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to registered email",
      email: customer.email
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

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found"
      });
    }

    if (customer.otp !== otp || customer.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    customer.isVerified = true;
    customer.otp = null;
    customer.otpExpiry = null;

    await customer.save();

    const token = jwt.sign(
      { id: customer._id },
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

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found"
      });
    }

    if (customer.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified"
      });
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    customer.otp = newOtp;
    customer.otpExpiry = Date.now() + 10 * 60 * 1000;

    await customer.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP - Verify Your Customer Account",
      html: `
        <h2>Hello ${customer.fullname}</h2>
        <p>Your new OTP is:</p>
        <h1>${newOtp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
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



/* ================= LOGIN CUSTOMER ================= */

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer not found"
      });
    }

    if (!customer.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      customer: {
        _id: customer._id,
        fullname: customer.fullname,
        email: customer.email
      }
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};