const Profile = require("../models/profileModel");

/* ================= CREATE PROFILE ================= */

exports.createProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      storename,
      storeaddress,
      profileimage,
    } = req.body;

    const existingProfile = await Profile.findOne({ email });

    if (existingProfile) {
      return res.json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = new Profile({
      fullname,
      email,
      phone,
      storename,
      storeaddress,
      profileimage,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET PROFILE ================= */

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PROFILE ================= */

exports.updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      storename,
      storeaddress,
      profileimage,
    } = req.body;

    const profile = await Profile.findOne();

    if (!profile) {
      return res.json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.fullname = fullname;
    profile.phone = phone;
    profile.storename = storename;
    profile.storeaddress = storeaddress;
    profile.profileimage = profileimage;

    await profile.save();

    res.json({
      success: true,
      message: "Profile updated",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};