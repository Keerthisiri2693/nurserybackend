const Profile = require("../models/customerprofile");
const jwt = require("jsonwebtoken");

/* ================= GET USER ID FROM TOKEN ================= */

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Token missing");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

/* ================= CREATE PROFILE ================= */

exports.createProfile = async (req, res) => {

  try {

    const userId = getUserIdFromToken(req);

    const { name, email, mobileNo, profileImage } = req.body;

    const existing = await Profile.findOne({ userId });

    if (existing) {
      return res.json({
        success: true,
        profile: existing
      });
    }

    const profile = await Profile.create({
      userId,
      name,
      email,
      mobileNo,
      profileImage
    });

    res.json({
      success: true,
      profile
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


/* ================= GET PROFILE ================= */

exports.getProfile = async (req, res) => {

  try {

    const userId = getUserIdFromToken(req);

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.json({
        success: false,
        message: "Profile not found"
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


/* ================= UPDATE PROFILE ================= */

exports.updateProfile = async (req, res) => {

  try {

    const userId = getUserIdFromToken(req);

    const { name, email, mobileNo, profileImage } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        name,
        email,
        mobileNo,
        profileImage
      },
      {
        new: true,
        upsert: true   // ⭐ THIS FIXES YOUR PROBLEM
      }
    );

    res.json({
      success: true,
      profile
    });

  } catch (error) {

    console.log("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};