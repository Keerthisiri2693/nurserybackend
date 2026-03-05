const bcrypt = require("bcryptjs");
const Seller = require("../models/Seller");

/* ================= CHANGE PASSWORD ================= */

exports.changePassword = async (req, res) => {
  try {

    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // IMPORTANT: select password because schema has select:false
    const user = await Seller.findOne({ email }).select("+password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Old password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};