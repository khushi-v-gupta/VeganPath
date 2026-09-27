const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const activityRoutes = require("./routes/activityRoutes");
const ayurvedaRoutes = require("./routes/ayurvedaRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const scannerRoutes = require("./routes/scanner");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/ayurveda", ayurvedaRoutes);
app.use("/api/meal-plan", mealPlanRoutes);
app.use("/api/scanner", scannerRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Vegan Path Backend is running!",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 5000}`,
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
