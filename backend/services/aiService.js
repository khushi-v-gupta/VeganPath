const OLLAMA_URL = "http://localhost:11434/api/generate";

async function generateRecipe({
  ingredients,
  cuisine,
  mealType,
  goal,
  calories,
}) {
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
- Do NOT use meat, chicken, fish, seafood, eggs, milk, cheese, butter, honey, gelatin, or any animal-derived ingredient.
- Give realistic ingredient quantities.
- Give clear cooking instructions.
- Provide estimated nutrition per serving.

Return ONLY valid JSON.
Do not use markdown.
Do not put the JSON inside code fences.

Return exactly this structure:

{
  "title": "",
  "cuisine": "",
  "mealType": "",
  "description": "",
  "ingredients": [
    {
      "name": "",
      "quantity": ""
    }
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

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemma3:4b",
      prompt: prompt,
      stream: false,
      format: "json"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ollama request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Ollama returned an empty response");
  }

  return JSON.parse(data.response);
}

module.exports = {
  generateRecipe
};