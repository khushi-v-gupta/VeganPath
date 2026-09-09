
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
            isDailyRecipe: { $ne: true }
        };


        // SEARCH BY RECIPE NAME
        if (search && search.trim()) {

            filter.title = {
                $regex: search.trim(),
                $options: "i"
            };

        }


        // FILTER BY CUISINE
        if (cuisine && cuisine.trim()) {

            filter.cuisine = {
                $regex: `^${cuisine.trim()}$`,
                $options: "i"
            };

        }


        // FILTER BY MEAL TYPE
        if (mealType && mealType.trim()) {

            filter.mealType = mealType.trim();

        }


        const recipes = await Recipe
            .find(filter)
            .sort({ createdAt: -1 });


        res.json({
            recipes
        });

    } catch (error) {

        console.error("GET RECIPES ERROR:", error);

        res.status(500).json({
            message: "Unable to load recipes",
            error: error.message
        });

    }
});


// =====================================================
// AI GENERATE RECIPE
// =====================================================

router.post("/generate", async (req, res) => {

    try {

        const {
            ingredients,
            cuisine,
            mealType,
            goal,
            calories
        } = req.body;


        console.log(
            "GENERATE RECIPE REQUEST:",
            req.body
        );


        if (
            !ingredients ||
            !cuisine ||
            !mealType ||
            !goal
        ) {

            return res.status(400).json({
                message:
                    "Ingredients, cuisine, meal type and goal are required"
            });

        }


        const recipe = await generateRecipe({
            ingredients,
            cuisine,
            mealType,
            goal,
            calories
        });


        console.log(
            "AI GENERATED RECIPE:",
            recipe
        );


        const savedRecipe =
            await Recipe.create(recipe);


        res.status(201).json({

            message:
                "AI recipe generated successfully",

            recipe: savedRecipe

        });


    } catch (error) {

        console.error(
            "========== AI RECIPE ERROR =========="
        );

        console.error(error);

        console.error(
            "===================================="
        );


        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


// =====================================================
// GET TODAY'S AI RECIPE
// =====================================================

router.get("/daily/today", async (req, res) => {

    try {

        const startOfDay = new Date();

        startOfDay.setHours(
            0,
            0,
            0,
            0
        );


        const endOfDay = new Date();

        endOfDay.setHours(
            23,
            59,
            59,
            999
        );


        let dailyRecipe =
            await Recipe.findOne({

                isDailyRecipe: true,

                dailyDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }

            });


        // TODAY'S RECIPE ALREADY EXISTS

        if (dailyRecipe) {

            return res.json({

                message:
                    "Today's recipe found",

                recipe: dailyRecipe

            });

        }


        // GENERATE NEW DAILY RECIPE

        const recipe =
            await generateRecipe({

                ingredients:
                    "seasonal vegetables, lentils, tofu, spinach",

                cuisine: "Indian",

                mealType: "Dinner",

                goal: "Balanced Nutrition",

                calories: 500

            });


        // SAVE AS DAILY RECIPE

        dailyRecipe =
            await Recipe.create({

                ...recipe,

                isDailyRecipe: true,

                dailyDate: new Date()

            });


        res.status(201).json({

            message:
                "Today's AI recipe generated",

            recipe: dailyRecipe

        });


    } catch (error) {

        console.error(
            "DAILY RECIPE ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Unable to generate today's recipe",

            error: error.message

        });

    }

});


// SEARCH RECIPES BY NAME
router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Recipe name is required"
            });
        }

        const recipes = await Recipe.find({
            title: {
                $regex: name.trim(),
                $options: "i"
            },
            isDailyRecipe: false
        }).sort({ createdAt: -1 });

        res.json({
            recipes
        });

    } catch (error) {
        console.error("SEARCH RECIPES ERROR:", error);

        res.status(500).json({
            message: "Failed to search recipes",
            error: error.message
        });
    }
});


// =====================================================
// GET SINGLE RECIPE
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        const recipe =
            await Recipe.findById(
                req.params.id
            );


        if (!recipe) {

            return res.status(404).json({

                message:
                    "Recipe not found"

            });

        }


        res.json(recipe);


    } catch (error) {

        console.error(
            "GET RECIPE ERROR:",
            error
        );


        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


module.exports = router;
