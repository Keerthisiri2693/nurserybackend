const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    name: { type: String, required: true },
    sku: { type: String, required: true },

    category: String,
    categoryName:String,
    section: String,
    subcategory: String,

    price: { type: Number, required: true },
    mrp: Number,

    stock: { type: Number, default: 0 },
    lowStockLimit: { type: Number, default: 5 },

    images: [String],

    light: String,
    watering: String,
    height: String,

    description: String,
    about: String,
    growing: String,
    care: String,
    uses: String,
    funFacts: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);