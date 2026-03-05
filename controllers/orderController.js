const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/product");

/* =====================================================
   CREATE ORDER (Customer Side)
===================================================== */
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customerId = req.user.id;

    const {
      customerName,
      address,
      paymentMethod,
      couponCode,
      discountAmount = 0,
      subtotal,
      deliveryCharge,
      totalAmount,
      products,
    } = req.body;

    if (
      !address ||
      !address.fullName ||
      !address.house ||
      !address.city ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = "ORD-" + Date.now();
    const updatedProducts = [];

    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      const productData = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { returnDocument: "after" }
      );

      if (!productData) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock or product not found",
        });
      }

      updatedProducts.push({
        productId: productData._id,
        name: productData.name,
        price: productData.price,
        quantity: item.quantity,
        image: productData.images?.[0] || "",
        sellerId: productData.seller,
        category: productData.categoryName,
      });
    }

    const sellerId = updatedProducts[0].sellerId;

    const newOrder = new Order({
      orderId,
      userId: customerId,
      sellerId,
      customerName,
      address,
      paymentMethod,
      couponApplied: !!couponCode,
      couponCode: couponCode || null,
      discountAmount,
      subtotal,
      deliveryCharge,
      totalAmount,
      products: updatedProducts,
      orderStatus: "Pending",
    });

    await newOrder.save();
    await Cart.deleteMany({ userId: customerId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.log("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   SELLER - GET ALL ORDERS
===================================================== */
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.log("Get Seller Orders Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   SELLER - GET SINGLE ORDER
===================================================== */
const getSingleOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log("Get Single Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   SELLER - UPDATE ORDER STATUS
===================================================== */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.log("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   CUSTOMER - GET MY ORDERS
===================================================== */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.log("Get My Orders Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   CUSTOMER - GET SINGLE ORDER
===================================================== */
const getCustomerSingleOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log("Get Customer Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   EXPORT ALL FUNCTIONS (IMPORTANT)
===================================================== */
module.exports = {
  createOrder,
  getSellerOrders,
  getSingleOrder,
  updateOrderStatus,
  getMyOrders,
  getCustomerSingleOrder,
};