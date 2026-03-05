const mongoose = require("mongoose");
const Address = require("../models/Address");

// ================= ADD ADDRESS =================
exports.addAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      mobile,
      pincode,
      house,
      area,
      city,
      state,
      landmark,
      type,
    } = req.body;

    if (
      !userId ||
      !fullName ||
      !mobile ||
      !pincode ||
      !house ||
      !area ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newAddress = new Address({
      userId,
      fullName,
      mobile,
      pincode,
      house,
      area,
      city,
      state,
      landmark,
      type,
    });

    await newAddress.save();

    res.json({
      success: true,
      message: "Address saved successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log("Add Address Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET USER ADDRESSES =================
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log("Get Address Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DELETE ADDRESS =================
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    await Address.findByIdAndDelete(addressId);

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log("Delete Address Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};