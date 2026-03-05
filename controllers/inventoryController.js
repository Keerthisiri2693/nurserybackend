const Product = require("../models/product");
const mongoose = require("mongoose");

exports.getLowStockProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { search = "", category = "All" } = req.query;

    let matchStage = {
      seller: new mongoose.Types.ObjectId(sellerId),
      status: "active",
      $expr: {
        $lte: [
          "$stock",
          { $ifNull: ["$lowStockLimit", 5] } // ✅ safe default
        ]
      }
    };

    // 🔍 Search filter
    if (search.trim()) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    // 📂 Category filter
    if (category !== "All") {
      matchStage.categoryName = category;
    }

    // 🔥 Fetch low stock products
    const lowStockProducts = await Product.find(matchStage)
      .sort({ stock: 1 })
      .lean();

    // 🔥 Fetch seller categories
    const sellerProducts = await Product.find({
      seller: new mongoose.Types.ObjectId(sellerId),
      status: "active",
    }).lean();

    const categories = [
      "All",
      ...new Set(
        sellerProducts
          .map((p) => p.categoryName)
          .filter(Boolean)
      ),
    ];

    res.status(200).json({
      success: true,
      categories,
      products: lowStockProducts.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.categoryName,
        stock: item.stock,
        lowStockLimit: item.lowStockLimit ?? 5, // ✅ correct value
      })),
    });

  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
