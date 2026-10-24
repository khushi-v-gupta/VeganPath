const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");
const { generateRecipe } = require("../services/aiService");

// =====================================================
// GET RECIPE LIBRARY
// EXCLUDES TODAY'S AI RECIPES
// SUPPORTS SEARCH
// =====================================================

router.get("/", async (req, res) => {
  try {
    const { search, cuisine, mealType } = req.query;

    const filter = {
      isDailyRecipe: { $ne: true },
    };

    // SEARCH BY RECIPE NAME
    if (search && search.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // FILTER BY CUISINE
    if (cuisine && cuisine.trim()) {
      filter.cuisine = {
        $regex: `^${cuisine.trim()}$`,
        $options: "i",
      };
    }

    // FILTER BY MEAL TYPE
    if (mealType && mealType.trim()) {
      filter.mealType = mealType.trim();
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });

    res.json({
      recipes,
    });
  } catch (error) {
    console.error("GET RECIPES ERROR:", error);

    res.status(500).json({
      message: "Unable to load recipes",
      error: error.message,
    });
  }
});

// =====================================================
// AI GENERATE RECIPE
// =====================================================

router.post("/generate", async (req, res) => {
  try {
    const { ingredients, cuisine, mealType, goal, calories } = req.body;

    console.log("GENERATE RECIPE REQUEST:", req.body);

    if (!ingredients || !cuisine || !mealType || !goal) {
      return res.status(400).json({
        message: "Ingredients, cuisine, meal type and goal are required",
      });
    }

    const recipe = await generateRecipe({
      ingredients,
      cuisine,
      mealType,
      goal,
      calories,
    });

    console.log("AI GENERATED RECIPE:", recipe);

    const savedRecipe = await Recipe.create(recipe);

    res.status(201).json({
      message: "AI recipe generated successfully",

      recipe: savedRecipe,
    });
  } catch (error) {
    console.error("========== AI RECIPE ERROR ==========");

    console.error(error);

    console.error("====================================");

    res.status(500).json({
      message: "Server error",

      error: error.message,
    });
  }
});

// =====================================================
// GET TODAY'S AI RECIPE
// =====================================================

// GET TODAY'S AI RECIPES
router.get("/daily/today", async (req, res) => {
  try {
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateValues = {};

    dateParts.forEach(({ type, value }) => {
      dateValues[type] = value;
    });

    const today = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

    console.log("Today's date:", today);

    const allDailyRecipes = await Recipe.find({
      isDailyRecipe: true,
    }).select("title isDailyRecipe dailyDate dailySlot");

    console.log("All daily recipes:", allDailyRecipes);

    const recipes = await Recipe.find({
      isDailyRecipe: true,
      dailyDate: today,
    }).sort({ dailySlot: 1 });

    console.log("Today's matched recipes:", recipes.length);
    res.json({
      message: recipes.length
        ? "Today's vegan recipes loaded"
        : "Today's recipes have not been generated yet",
      recipes,
      recipe: recipes[0] || null,
    });
  } catch (error) {
    console.error("DAILY RECIPES ERROR:", error);

    res.status(500).json({
      message: "Unable to load today's recipes",
      error: error.message,
    });
  }
});

// POST /daily/generate
// Secure endpoint called by the scheduled workflow
router.post("/daily/generate", async (req, res) => {
  try {
    const crypto = require("crypto");

    const expectedSecret = process.env.CRON_SECRET;
    const suppliedSecret = req.get("x-cron-secret") || "";

    if (
      !expectedSecret ||
      !suppliedSecret ||
      Buffer.byteLength(expectedSecret) !== Buffer.byteLength(suppliedSecret) ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSecret),
        Buffer.from(suppliedSecret),
      )
    ) {
      return res.status(401).json({
        message: "Unauthorized scheduler request",
      });
    }

    const { slot } = req.body;

    if (!["03:00", "15:00"].includes(slot)) {
      return res.status(400).json({
        message: 'Invalid slot. Use "03:00" or "15:00".',
      });
    }

    // Get today's date in Indian Standard Time
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateValues = {};
    dateParts.forEach(({ type, value }) => {
      dateValues[type] = value;
    });

    const dailyDate = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

    // Avoid generating the same slot twice on the same day
    const existingRecipe = await Recipe.findOne({
      isDailyRecipe: true,
      dailyDate,
      dailySlot: slot,
    });

    if (existingRecipe) {
      return res.json({
        message: "Recipe already generated for this slot",
        recipe: existingRecipe,
      });
    }

    // Randomly choose recipe requirements
    const options = [
      {
        cuisine: "Indian",
        mealType: "Breakfast",
        ingredients: "oats, banana, almonds, plant-based milk",
      },
      {
        cuisine: "Mediterranean",
        mealType: "Lunch",
        ingredients: "chickpeas, cucumber, tomato, olive oil",
      },
      {
        cuisine: "Indian",
        mealType: "Dinner",
        ingredients: "lentils, spinach, tomatoes, spices",
      },
      {
        cuisine: "Asian",
        mealType: "Lunch",
        ingredients: "tofu, broccoli, carrots, rice",
      },
      {
        cuisine: "Mexican",
        mealType: "Snack",
        ingredients: "black beans, corn, tomatoes, avocado",
      },
      {
        cuisine: "Indian",
        mealType: "Dinner",
        ingredients: "chickpeas, potatoes, peas, spices",
      },
    ];

    const selected = options[Math.floor(Math.random() * options.length)];

    const recipe = await generateRecipe({
      ingredients: selected.ingredients,
      cuisine: selected.cuisine,
      mealType: selected.mealType,
      goal: "Balanced Nutrition",
      calories: 400 + Math.floor(Math.random() * 201),
    });

    const savedRecipe = await Recipe.create({
      ...recipe,
      isDailyRecipe: true,
      dailyDate,
      dailySlot: slot,
    });

    return res.status(201).json({
      message: "Daily vegan recipe generated and saved",
      recipe: savedRecipe,
    });
  } catch (error) {
    console.error("SCHEDULED RECIPE ERROR:", error);

    return res.status(500).json({
      message: "Unable to generate daily recipe",
      error: error.message,
    });
  }
});

// SEARCH RECIPES BY NAME
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Recipe name is required",
      });
    }

    const recipes = await Recipe.find({
      title: {
        $regex: name.trim(),
        $options: "i",
      },
      isDailyRecipe: false,
    }).sort({ createdAt: -1 });

    res.json({
      recipes,
    });
  } catch (error) {
    console.error("SEARCH RECIPES ERROR:", error);

    res.status(500).json({
      message: "Failed to search recipes",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE RECIPE
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.json(recipe);
  } catch (error) {
    console.error("GET RECIPE ERROR:", error);

    res.status(500).json({
      message: "Server error",

      error: error.message,
    });
  }
});

module.exports = router;
