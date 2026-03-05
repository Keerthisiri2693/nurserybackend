const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const wishlistRoutes = require("./routes/wishlistRoutes");
const earningRoutes = require("./routes/earningRoutes"); // ✅ ADD THIS
const analyticsRoutes = require("./routes/analyticsRoutes")
const inventoryRoutes = require("./routes/inventoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const profileRoutes = require("./routes/profileRoutes");

const authRoutes = require("./routes/authRoutes");

const ticketRoutes = require("./routes/ticketRoutes");

const customerprofileRoutes = require("./routes/customerprofileRoutes");


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder
app.use("/uploads", express.static("uploads"));


app.use("/api/categories", categoryRoutes);

// Routes
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/orders", require("./routes/orderRoutes")); // ✅ only once
app.use("/api/profile",customerprofileRoutes);


app.use("/api/reviews", reviewRoutes);


app.use("/api/wishlist", wishlistRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/inventory", inventoryRoutes);


app.use("/api/profile", profileRoutes);



app.use("/api/auth", authRoutes);




app.use("/api/tickets", ticketRoutes);
// Test Route (optional but recommended)
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);