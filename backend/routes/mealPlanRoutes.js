const express = require("express");
const { GoogleGenAI } = require("@google/genai");

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
      cookingTime,
    } = req.body;

    if (!age || !height || !weight) {
      return res.status(400).json({
        message: "Age, height and weight are required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured",
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

RULES:
1. Every meal must be vegan.
2. Never include meat, fish, eggs, milk, curd, paneer or ghee.
3. Never include foods listed as allergies.
4. Avoid disliked foods.
5. Prefer Indian foods when Indian cuisine is selected.
6. Keep meals practical and affordable.
7. Respect the cooking time.
8. Provide realistic nutritional estimates.
9. Return only valid JSON without markdown.
10. Include exactly ${mealsPerDay || 4} meals in the meals array.

Return this JSON structure:
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
    }
  ]
}

Ensure calories, protein, carbs and fat represent estimated daily totals.
`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const mealPlan = JSON.parse(text);

    if (!Array.isArray(mealPlan.meals)) {
      throw new Error("Invalid meal plan structure returned by Gemini");
    }

    res.json(mealPlan);
  } catch (error) {
    console.error("MEAL PLAN ERROR:", error);

    res.status(500).json({
      message: "Failed to generate meal plan",
    });
  }
});

module.exports = router;

