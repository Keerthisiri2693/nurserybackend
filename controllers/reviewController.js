const Review = require("../models/reviewModel");

/* ================= ADD REVIEW ================= */

exports.addReview = async (req, res) => {
  try {
    const { productId, userName, rating, comment, image } = req.body;

    const review = new Review({
      productId,
      userName,
      rating,
      comment,
      image,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ================= GET PRODUCT REVIEWS ================= */

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};