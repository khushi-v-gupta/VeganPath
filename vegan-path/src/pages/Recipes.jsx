import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [mealType, setMealType] = useState("Dinner");
  const [goal, setGoal] = useState("High Protein");
  const [calories, setCalories] = useState(500);

  const [aiRecipe, setAiRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dailyRecipe, setDailyRecipe] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [nutritionData, setNutritionData] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(true);

  useEffect(() => {
    const fetchDailyRecipe = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/recipes/daily/today",
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to load daily recipe",
          );
        }

        setDailyRecipe(data.recipe);
      } catch (error) {
        console.error("Daily recipe error:", error);
      } finally {
        setDailyLoading(false);
      }
    };

    fetchDailyRecipe();
  }, []);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        setNutritionLoading(true);

        const response = await fetch("http://localhost:5000/api/nutrition");

        if (!response.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const data = await response.json();

        setNutritionData(data.nutrition || []);
      } catch (error) {
        console.error("Nutrition fetch error:", error);
      } finally {
        setNutritionLoading(false);
      }
    };

    fetchNutrition();
  }, []);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    setError("");
    setAiRecipe(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/recipes/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients,
            cuisine,
            mealType,
            goal,
            calories,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to generate recipe",
        );
      }

      setAiRecipe(data.recipe);
    } catch (err) {
      console.error("Recipe generation error:", err);
      setError(
        "Unable to generate recipe. Make sure your backend and Ollama are running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <span>VEGAN RECIPES</span>

        <h1>Eat Well. Feel Good. 🌱</h1>

        <p>
          Discover nutritious vegan recipes from Indian, Asian and global
          cuisines.
        </p>
      </div>

      {/* RECIPE OF THE DAY */}
      <div className="daily-recipe-section">
        <div className="daily-recipe-heading">
          <span>🌱 VEGAN PATH DAILY</span>

          <h2>Today's AI Recipe</h2>

          <p>A fresh vegan recipe created especially for today.</p>
        </div>

        {dailyLoading && (
          <div className="daily-loading">🤖 Creating today's recipe...</div>
        )}

        {!dailyLoading && dailyRecipe && (
          <div className="daily-recipe-card">
            <div className="daily-recipe-content">
              <span className="daily-badge">✨ RECIPE OF THE DAY</span>

              <h2>{dailyRecipe.title}</h2>

              <p>{dailyRecipe.description}</p>

              <div className="daily-recipe-stats">
                <div>
                  🍽️
                  <strong>{dailyRecipe.cuisine}</strong>
                </div>

                <div>
                  ⏱️
                  <strong>{dailyRecipe.prepTime} min</strong>
                </div>

                <div>
                  🔥
                  <strong>{dailyRecipe.nutrition?.calories ?? "—"} kcal</strong>
                </div>

                <div>
                  💪
                  <strong>
                    {dailyRecipe.nutrition?.protein ?? "—"}g protein
                  </strong>
                </div>
              </div>

              <h3>🥗 Ingredients</h3>

              <ul>
                {dailyRecipe.ingredients?.map((ingredient, index) => (
                  <li key={ingredient._id || index}>
                    <strong>{ingredient.quantity}</strong> {ingredient.name}
                  </li>
                ))}
              </ul>

              <h3>👨‍🍳 Instructions</h3>

              <ol>
                {dailyRecipe.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {!dailyLoading && !dailyRecipe && (
          <div className="daily-loading">
            Today's recipe could not be loaded.
          </div>
        )}
      </div>

      {/* ============================= */}
      {/* CUISINE NUTRITION */}
      {/* ============================= */}

      <div className="cuisine-nutrition-section">
        <div className="cuisine-nutrition-heading">
          <span>🥗 NUTRITION GUIDE</span>

          <h2>Nutrition by Cuisine</h2>

          <p>Explore the nutritional profile of popular vegan cuisines.</p>
        </div>

        <div className="cuisine-grid">
          {nutritionLoading && (
            <div className="nutrition-loading">
              🥗 Loading nutrition information...
            </div>
          )}

          {!nutritionLoading && nutritionData.length === 0 && (
            <div className="nutrition-loading">
              Nutrition information is currently unavailable.
            </div>
          )}

          {!nutritionLoading &&
            nutritionData.map((item) => (
              <div className="cuisine-card" key={item._id}>
                <div className="cuisine-icon">
                  {item.cuisine === "Indian" && "🇮🇳"}
                  {item.cuisine === "Asian" && "🍜"}
                  {item.cuisine === "Italian" && "🍝"}
                  {item.cuisine === "Mexican" && "🌮"}
                  {item.cuisine === "Thai" && "🍲"}
                  {item.cuisine === "Japanese" && "🍱"}
                </div>

                <h3>{item.cuisine}</h3>

                <p>{item.description}</p>

                <div className="cuisine-nutrition">
                  <div>
                    <strong>{item.calories}</strong>

                    <span>Calories</span>
                  </div>

                  <div>
                    <strong>{item.protein}g</strong>

                    <span>Protein</span>
                  </div>

                  <div>
                    <strong>{item.carbohydrates}g</strong>

                    <span>Carbs</span>
                  </div>

                  <div>
                    <strong>{item.fiber}g</strong>

                    <span>Fiber</span>
                  </div>
                </div>

                {/* EXTRA NUTRITION */}

                <div className="extra-nutrition">
                  <span>Fat: {item.fat}g</span>

                  <span>Iron: {item.iron}mg</span>

                  <span>Calcium: {item.calcium}mg</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* AI RECIPE GENERATOR */}
      <div className="ai-recipe-generator">
        <div className="ai-heading">
          <span>🤖 AI RECIPE GENERATOR</span>

          <h2>Create Your Own Vegan Recipe 🌱</h2>

          <p>
            Tell our AI what ingredients you have and get a personalized vegan
            recipe with nutrition information.
          </p>
        </div>

        {/* INGREDIENTS */}
        <div className="form-group">
          <label>Ingredients</label>

          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Example: tofu, spinach, tomato"
          />
        </div>

        {/* OPTIONS */}
        <div className="recipe-options">
          <div className="form-group">
            <label>Cuisine</label>

            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option>Indian</option>
              <option>Italian</option>
              <option>Asian</option>
              <option>Mexican</option>
              <option>Thai</option>
              <option>Japanese</option>
              <option>Global</option>
            </select>
          </div>

          <div className="form-group">
            <label>Meal Type</label>

            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          <div className="form-group">
            <label>Health Goal</label>

            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>High Protein</option>
              <option>Weight Management</option>
              <option>Healthy</option>
              <option>Energy</option>
              <option>Balanced Nutrition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Target Calories</label>

            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min="100"
              max="2000"
            />
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <button
          className="generate-recipe-btn"
          onClick={generateRecipe}
          disabled={loading}
        >
          {loading ? "🤖 Creating Your Recipe..." : "✨ Generate Vegan Recipe"}
        </button>

        {/* ERROR */}
        {error && <p className="recipe-error">⚠️ {error}</p>}
      </div>

      {/* AI RESULT */}
      {aiRecipe && (
        <div className="ai-recipe-result">
          <div className="ai-result-header">
            <span>✨ AI GENERATED RECIPE</span>

            <h2>{aiRecipe.title}</h2>

            <p>{aiRecipe.description}</p>
          </div>

          {/* BASIC INFORMATION */}
          <div className="recipe-info">
            <div>
              🍽️
              <strong>{aiRecipe.cuisine}</strong>
              <span>Cuisine</span>
            </div>

            <div>
              ⏱️
              <strong>{aiRecipe.prepTime} min</strong>
              <span>Prep Time</span>
            </div>

            <div>
              🔥
              <strong>{aiRecipe.nutrition.calories} kcal</strong>
              <span>Calories</span>
            </div>

            <div>
              💪
              <strong>{aiRecipe.nutrition.protein} g</strong>
              <span>Protein</span>
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="recipe-section">
            <h3>🥗 Ingredients</h3>

            <ul>
              {aiRecipe.ingredients.map((item, index) => (
                <li key={item._id || index}>
                  <strong>{item.quantity}</strong> {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* INSTRUCTIONS */}
          <div className="recipe-section">
            <h3>👨‍🍳 Instructions</h3>

            <ol>
              {aiRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* NUTRITION */}
          <div className="nutrition-section">
            <h3>📊 Nutritional Value Per Serving</h3>

            <div className="nutrition-grid">
              <div>
                <strong>{aiRecipe.nutrition.calories}</strong>
                <span>Calories</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.protein}g</strong>
                <span>Protein</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.carbohydrates}g</strong>
                <span>Carbs</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.fat}g</strong>
                <span>Fat</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.fiber}g</strong>
                <span>Fiber</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.iron}mg</strong>
                <span>Iron</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.calcium}mg</strong>
                <span>Calcium</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="search-box">
        <input type="text" placeholder="Search recipes..." />

        <button>🔍 Search</button>
      </div>

      {/* CATEGORIES */}
      <div className="category-buttons">
        <button className="active">All</button>
        <button>Breakfast</button>
        <button>Lunch</button>
        <button>Dinner</button>
        <button>Snacks</button>
        <button>Indian</button>
        <button>High Protein</button>
      </div>

      {/* EXISTING RECIPES */}
      <div className="recipe-grid">
        <RecipeCard
          image="https://images.unsplash.com/photo-1547592180-85f173990554"
          title="Rainbow Buddha Bowl"
          category="Lunch"
          time="20 min"
          calories="420"
        />

        <RecipeCard
          image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
          title="Green Power Salad"
          category="Healthy"
          time="15 min"
          calories="280"
        />

        <RecipeCard
          image="https://images.unsplash.com/photo-1601050690597-df0568f70950"
          title="Vegetable Dumplings"
          category="Dinner"
          time="35 min"
          calories="390"
        />

        <RecipeCard
          image="https://images.unsplash.com/photo-1603133872878-684f208fb84b"
          title="Vegetable Fried Rice"
          category="Asian"
          time="25 min"
          calories="410"
        />

        <RecipeCard
          image="https://images.unsplash.com/photo-1547592166-23ac45744acd"
          title="Creamy Lentil Soup"
          category="High Protein"
          time="30 min"
          calories="350"
        />

        <RecipeCard
          image="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7"
          title="Indian Vegetable Curry"
          category="Indian"
          time="40 min"
          calories="430"
        />
      </div>
    </div>
  );
}

export default Recipes;
