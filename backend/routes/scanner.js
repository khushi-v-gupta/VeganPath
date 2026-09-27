const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Scanner route is working",
  });
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post("/analyze", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Extract base64 data from data:image/jpeg;base64,...
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);

    if (!matches) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format",
      });
    }

    const mimeType = matches[1];
    const base64Image = matches[2];

    const prompt = `
You are the AI food scanner for Vegan Path.

Analyze the provided image and identify the visible food or food product.

Classify it into EXACTLY ONE of these categories:

Vegan
Vegetarian
Non-Vegetarian
Unclear

Rules:

1. Vegan:
   No visible animal-derived food or ingredient is identified.

2. Vegetarian:
   No meat, chicken, fish, seafood, or egg is identified, but a dairy-derived
   ingredient such as milk, cheese, butter, curd, yogurt, paneer, or similar
   is visible or clearly stated.

3. Non-Vegetarian:
   Meat, chicken, fish, seafood, egg, or other animal flesh/animal-derived
   food that is not considered vegetarian is visible or clearly identified.

4. Unclear:
   The image is insufficient to determine the classification reliably.


IMPORTANT:
- Eggs and egg-containing foods MUST be classified as Non-Vegetarian.
- Foods containing egg as an ingredient MUST be classified as Non-Vegetarian.
- Do not classify eggs as Vegetarian for this application.

For packaged food:
- Carefully inspect visible text and ingredient labels.
- Use visible ingredients when available.
- Do NOT assume hidden ingredients.
- If important ingredients cannot be determined, classify as Unclear.

Return ONLY valid JSON.

The JSON must contain:

foodName: string
classification: one of Vegan, Vegetarian, Non-Vegetarian, Unclear
confidence: integer from 0 to 100
detectedIngredients: array of strings
reason: string
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            foodName: {
              type: "string",
            },
            classification: {
              type: "string",
              enum: ["Vegan", "Vegetarian", "Non-Vegetarian", "Unclear"],
            },
            confidence: {
              type: "integer",
            },
            detectedIngredients: {
              type: "array",
              items: {
                type: "string",
              },
            },
            reason: {
              type: "string",
            },
          },
          required: [
            "foodName",
            "classification",
            "confidence",
            "detectedIngredients",
            "reason",
          ],
        },
      },
    });

    const result = JSON.parse(response.text);

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Food Scanner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Food analysis failed",
    });
  }
});

module.exports = router;
