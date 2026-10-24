const GEMINI_MODEL = "gemini-3.8-flash";

async function generateRecipe({
  ingredients,
  cuisine,
  mealType,
  goal,
  calories,
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
  }

  const prompt = `
You are Vegan Path's AI recipe assistant.

Create ONE completely vegan recipe.

User requirements:
- Available ingredients: ${ingredients}
- Cuisine: ${cuisine}
- Meal type: ${mealType}
- Health goal: ${goal}
- Target calories: ${calories || "not specified"}

Rules:
- The recipe must be 100% vegan.
- Never include meat, chicken, fish, seafood, eggs, milk, cheese,
  butter, honey, gelatin, or any animal-derived ingredient.
- Use realistic ingredient quantities.
- Give clear cooking instructions.
- Provide estimated nutrition per serving.
- Meal type must be exactly one of: Breakfast, Lunch, Dinner, Snack.
- Difficulty must be exactly one of: Easy, Medium, Hard.
- Return only valid JSON, without Markdown or code fences.

Use this exact structure:
{
  "title": "",
  "cuisine": "",
  "mealType": "",
  "description": "",
  "ingredients": [
    { "name": "", "quantity": "" }
  ],
  "instructions": [],
  "nutrition": {
    "calories": 0,
    "protein": 0,
    "carbohydrates": 0,
    "fat": 0,
    "fiber": 0,
    "iron": 0,
    "calcium": 0
  },
  "prepTime": 0,
  "difficulty": "Easy"
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 1,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!generatedText) {
    throw new Error("Gemini returned an empty response");
  }

  let recipe;

  try {
    recipe = JSON.parse(generatedText);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const requiredFields = [
    "title",
    "cuisine",
    "mealType",
    "ingredients",
    "instructions",
    "nutrition",
  ];

  for (const field of requiredFields) {
    if (recipe[field] === undefined || recipe[field] === null) {
      throw new Error(`Generated recipe is missing the ${field} field`);
    }
  }

  return recipe;
}

module.exports = {
  generateRecipe,
};
