const express = require("express");

const router = express.Router();

router.post("/generate", async (req, res) => {

  try {

    const {
      goal,
      age,
      gender,
      height,
      weight,
      activity,
      cuisine,
      mealsPerDay,
      allergies,
      dislikes,
      budget,
      cookingTime
    } = req.body;

    if (!age || !height || !weight) {
      return res.status(400).json({
        message: "Age, height and weight are required"
      });
    }

    const prompt = `
You are a professional vegan nutrition meal planner.

Create a personalized ONE-DAY vegan meal plan.

USER INFORMATION:

Goal: ${goal}
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Activity Level: ${activity}
Cuisine: ${cuisine}
Meals Per Day: ${mealsPerDay}
Allergies: ${allergies || "None"}
Foods disliked: ${dislikes || "None"}
Budget: ${budget}
Maximum cooking time: ${cookingTime} minutes

IMPORTANT RULES:

1. Every meal MUST be vegan.
2. Never include meat, fish, eggs, milk, curd, paneer or ghee.
3. Never include foods listed as allergies.
4. Avoid disliked foods.
5. Prefer Indian foods when Indian cuisine is selected.
6. Keep meals practical and affordable.
7. Respect the cooking time.
8. Provide realistic nutritional estimates.
9. Return ONLY valid JSON.
10. Do not use markdown.

Return exactly this structure:

{
  "calories": 2200,
  "protein": 90,
  "carbs": 300,
  "fat": 70,
  "meals": [
    {
      "type": "Breakfast",
      "name": "Meal name",
      "description": "Short description",
      "calories": 500,
      "protein": 20
    },
    {
      "type": "Lunch",
      "name": "Meal name",
      "description": "Short description",
      "calories": 650,
      "protein": 25
    },
    {
      "type": "Snack",
      "name": "Meal name",
      "description": "Short description",
      "calories": 300,
      "protein": 10
    },
    {
      "type": "Dinner",
      "name": "Meal name",
      "description": "Short description",
      "calories": 650,
      "protein": 30
    }
  ]
}
`;

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: false,
          format: "json"
        })
      }
    );

    const data = await response.json();

    const mealPlan = JSON.parse(data.response);

    res.json(mealPlan);

  } catch (error) {

    console.error(
      "MEAL PLAN ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to generate meal plan"
    });

  }

});

module.exports = router;