const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.getSellerEarnings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { filter } = req.query;

    const now = new Date();
    let startDate = null;

    // ✅ FILTER LOGIC (Frontend Compatible)
    switch (filter) {
      case "Today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;

      case "Week":
      case "This Week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;

      case "Month":
      case "This Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case "Year":
      case "This Year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

      case "All Time":
      default:
        startDate = null;
    }

    // ✅ MATCH STAGE
    let matchStage = {
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderStatus: "Delivered",
    };

    if (startDate) {
      matchStage.createdAt = { $gte: startDate };
    }

    // ✅ FETCH ORDERS
    const orders = await Order.find(matchStage).sort({ createdAt: -1 });

    // ✅ CALCULATIONS
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalOrders = orders.length;
    const commission = Math.round(totalRevenue * 0.1);
    const netEarnings = totalRevenue - commission;

    // ✅ RESPONSE
    res.status(200).json({
      success: true,
      filter: filter || "All Time",
      totalRevenue,
      totalOrders,
      commission,
      netEarnings,
      transactions: orders.map((order) => ({
        id: order._id,
        orderId: order.orderId,
        amount: order.totalAmount,
        date: order.createdAt,
      })),
    });

  } catch (error) {
    console.error("Earnings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};