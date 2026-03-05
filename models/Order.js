const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* ================= USER INFO ================= */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= ADDRESS SNAPSHOT ================= */

    address: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      house: { type: String, required: true },
      area: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String },
      type: { type: String },
    },

    /* ================= PAYMENT ================= */

    paymentMethod: {
      type: String,
      enum: ["UPI", "Credit Card", "Cash on Delivery"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    couponCode: {
      type: String,
      default: null,
    },

    couponApplied: {
      type: Boolean,
      default: false,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= PRICE DETAILS ================= */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ================= PRODUCTS ================= */

    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },

          sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
          },

          name: {
            type: String,
            required: true,
          },

          price: {
            type: Number,
            required: true,
            min: 0,
          },

          quantity: {
            type: Number,
            required: true,
            min: 1,
          },

          image: {
            type: String,
          },
          category:{
            type:String,
          },
        },
      ],
      default: [],
    },

    /* ================= ORDER STATUS ================= */

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Order Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXES ================= */

// Fast seller dashboard queries
orderSchema.index({ sellerId: 1, orderStatus: 1 });

// User order history
orderSchema.index({ userId: 1 });

// If you ever support multi-seller order split
orderSchema.index({ "products.sellerId": 1 });

/* ================= OPTIONAL VIRTUAL ================= */

// Total item count (useful for frontend)
orderSchema.virtual("totalItems").get(function () {
  return this.products.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model("Order", orderSchema);