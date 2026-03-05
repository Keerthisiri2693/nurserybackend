const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { filter } = req.query;

    const now = new Date();
    let startDate = null;

    // ================= FILTER LOGIC =================
    switch (filter) {
      case "Today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;

      case "Week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;

      case "Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case "Year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

      default:
        startDate = null;
    }

    let matchStage = {
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderStatus: "Delivered",
    };

    if (startDate) {
      matchStage.createdAt = { $gte: startDate };
    }

    // ================= FETCH ORDERS =================
    const orders = await Order.find(matchStage);

    // ================= TOTAL REVENUE =================
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalOrders = orders.length;

    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // ================= PROPER MONTHLY TREND (Last 6 Months) =================
    const revenueTrend = [];
    const monthLabels = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const month = date.getMonth();
      const year = date.getFullYear();

      const monthlyRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === month &&
            orderDate.getFullYear() === year
          );
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

      revenueTrend.push(monthlyRevenue);

      monthLabels.push(
        date.toLocaleString("default", { month: "short" })
      );
    }

    // ================= TOP PRODUCTS =================
    const productMap = {};

    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = {
            id: item.productId,
            name: item.name,
            category: item.category, // update if Product model has category
            sales: 0,
            revenue: 0,
          };
        }

        productMap[item.name].sales += item.quantity;
        productMap[item.name].revenue += item.quantity * item.price;
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // ================= CATEGORY PERFORMANCE =================
    const categoryPerformance = {};

    orders.forEach((order) => {
      order.products.forEach((item) => {
        const category = item.category; // replace if category exists in product schema

        if (!categoryPerformance[category]) {
          categoryPerformance[category] = 0;
        }

        categoryPerformance[category] += item.quantity * item.price;
      });
    });

    // ================= FINAL RESPONSE =================
    res.status(200).json({
      success: true,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueTrend,
      monthLabels,
      topProducts,
      categoryPerformance,
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};