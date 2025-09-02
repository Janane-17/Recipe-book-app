const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(express.json());

// Import routes
const recipeRoutes = require("./routes/recipeRoutes");
app.use("/recipes", recipeRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
