const express = require("express");
const router = express.Router();

const Nutrition = require("../models/Nutrition");


// GET ALL CUISINES
router.get("/", async (req, res) => {
  try {

    const nutrition = await Nutrition.find().sort({ cuisine: 1 });

    res.json({
      nutrition
    });

  } catch (error) {

    console.error("GET NUTRITION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch nutrition data",
      error: error.message
    });

  }
});


// GET NUTRITION BY CUISINE
router.get("/:cuisine", async (req, res) => {
  try {

    const cuisine = req.params.cuisine;

    const nutrition = await Nutrition.findOne({
      cuisine: {
        $regex: `^${cuisine}$`,
        $options: "i"
      }
    });

    if (!nutrition) {
      return res.status(404).json({
        message: "Cuisine nutrition data not found"
      });
    }

    res.json({
      nutrition
    });

  } catch (error) {

    console.error("GET CUISINE NUTRITION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch cuisine nutrition",
      error: error.message
    });

  }
});


module.exports = router;