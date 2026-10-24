const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

// Search nutrition data using the free USDA FoodData Central API
// IMPORTANT: Add USDA_API_KEY to your backend environment variables.
router.get("/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.status(400).json({
        message: "Please enter at least 2 characters to search.",
      });
    }

    const apiKey = process.env.USDA_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message:
          "Nutrition search is not configured. Add USDA_API_KEY to the backend environment variables.",
      });
    }

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}&pageSize=10`,
    );

    if (!response.ok) {
      console.error("USDA API response status:", response.status);

      return res.status(response.status === 429 ? 429 : 502).json({
        message:
          response.status === 429
            ? "Nutrition search limit reached. Please try again later."
            : "The nutrition database is temporarily unavailable.",
      });
    }

    const data = await response.json();

    const getNutrient = (nutrients, nutrientId) => {
      const nutrient = nutrients?.find(
        (item) => item.nutrientId === nutrientId,
      );

      return nutrient
        ? {
            value: nutrient.value,
            unit: nutrient.unitName,
          }
        : { value: null, unit: "" };
    };

    const foods = (data.foods || []).map((food) => {
      const nutrients = food.foodNutrients || [];

      return {
        id: food.fdcId,
        name: food.description,
        dataType: food.dataType || "Food",
        servingSize: "Values per 100 g where applicable",
        calories: getNutrient(nutrients, 1008),
        protein: getNutrient(nutrients, 1003),
        carbohydrates: getNutrient(nutrients, 1005),
        fat: getNutrient(nutrients, 1004),
        fiber: getNutrient(nutrients, 1079),
        iron: getNutrient(nutrients, 1089),
        calcium: getNutrient(nutrients, 1087),
      };
    });

    return res.json({
      source: "USDA FoodData Central",
      foods,
    });
  } catch (error) {
    console.error("USDA NUTRITION SEARCH ERROR:", error);

    return res.status(500).json({
      message: "Failed to search nutrition data.",
    });
  }
});

// GET ALL SAVED MEALS
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find().sort({ name: 1 });
    res.json({ meals });
  } catch (error) {
    console.error("GET MEALS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch meals",
    });
  }
});

// GET SAVED MEAL BY NAME
router.get("/:name", async (req, res) => {
  try {
    const meal = await Meal.findOne({
      name: {
        $regex: `^${req.params.name}$`,
        $options: "i",
      },
    });

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    res.json({ meal });
  } catch (error) {
    console.error("GET MEAL ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch meal",
    });
  }
});

module.exports = router;