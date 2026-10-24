import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./RecipeDetails.css";
import API_URL from "../api";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const onlineRecipe = location.state?.recipe;

  console.log("ONLINE RECIPE DATA:", onlineRecipe);
  console.log("RECIPE URL ID:", id);

  const formatOnlineRecipe = (recipe) => {
    if (!recipe) return null;

    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : [];

    let instructions = [];

    if (Array.isArray(recipe.instructions)) {
      instructions = recipe.instructions;
    } else if (typeof recipe.instructions === "string") {
      instructions = recipe.instructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean);
    }

    // Fallback if instructions are stored in description
    if (instructions.length === 0 && recipe.description) {
      instructions = recipe.description
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean);
    }

    return {
      ...recipe,
      title: recipe.title || recipe.strMeal || "Untitled Recipe",
      cuisine: recipe.cuisine || recipe.strArea || "Global",
      mealType: recipe.mealType || recipe.strCategory || "Vegan",
      image: recipe.image || recipe.strMealThumb || "",
      ingredients,
      instructions,
    };
  };

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      setError("");

      // Recipe data Recipes.jsx se aaya hai
      if (onlineRecipe) {
        setRecipe(formatOnlineRecipe(onlineRecipe));
        setLoading(false);
        return;
      }

      // MongoDB recipe ke liye backend se data lao
      if (!/^[a-f\d]{24}$/i.test(id || "")) {
        setError(
          "Recipe details are unavailable. Please open the recipe again.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/recipes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load recipe");
        }

        setRecipe(data.recipe || data);
      } catch (error) {
        console.error("RECIPE DETAILS ERROR:", error);
        setError(error.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, onlineRecipe]);

  if (loading) {
    return (
      <div className="recipe-details-page">
        {" "}
        <div className="recipe-details-loading">🌱 Loading recipe... </div>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-details-page">
        {" "}
        <div className="recipe-details-error">
          {" "}
          <div className="recipe-error-icon">⚠️</div>
          <h2>Unable to load recipe</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate("/recipes")}>
            ← Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="recipe-details-page">
      {/* BACK BUTTON */}
      <button
        className="recipe-back-button"
        onClick={() => navigate("/recipes")}
      >
        ← Back to Recipes
      </button>
      {/* HERO */}
      <section className="recipe-details-hero">
        <div className="recipe-details-image">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} />
          ) : (
            <div className="recipe-image-placeholder">🥗</div>
          )}
        </div>

        <div className="recipe-details-intro">
          <span className="recipe-details-badge">{recipe.cuisine}</span>

          <h1>{recipe.title}</h1>

          {recipe.description && (
            <p className="recipe-description">{recipe.description}</p>
          )}

          <div className="recipe-meta">
            <div>
              <span>⏱</span>
              <strong>{recipe.prepTime || 0} min</strong>
              <small>Prep Time</small>
            </div>

            <div>
              <span>📊</span>
              <strong>{recipe.difficulty || "Easy"}</strong>
              <small>Difficulty</small>
            </div>

            <div>
              <span>🍽️</span>
              <strong>{recipe.mealType}</strong>
              <small>Meal Type</small>
            </div>

            <div>
              <span>🔥</span>
              <strong>{recipe.nutrition?.calories ?? 0}</strong>
              <small>Calories</small>
            </div>
          </div>
        </div>
      </section>
      {/* CONTENT */}
      <section className="recipe-details-content">
        {/* INGREDIENTS */}
        <div className="recipe-detail-card">
          <div className="detail-card-heading">
            <span>🥗</span>

            <div>
              <span>WHAT YOU NEED</span>
              <h2>Ingredients</h2>
            </div>
          </div>

          <ul className="ingredients-list">
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={ingredient._id || index}>
                <span className="ingredient-dot">✓</span>

                <span>
                  <strong>{ingredient.quantity}</strong> {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* INSTRUCTIONS */}
        <div className="recipe-detail-card">
          <div className="detail-card-heading">
            <span>👨‍🍳</span>

            <div>
              <span>STEP BY STEP</span>
              <h2>Instructions</h2>
            </div>
          </div>

          <ol className="instructions-list">
            {recipe.instructions?.map((instruction, index) => (
              <li key={index}>
                <span className="instruction-number">{index + 1}</span>

                <p>{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* NUTRITION */}
      <section className="recipe-detail-card recipe-nutrition-card">
        <div className="detail-card-heading">
          <span>📊</span>

          <div>
            <span>NUTRITION</span>
            <h2>Per Serving</h2>
          </div>
        </div>

        <div className="recipe-nutrition-grid">
          <div>
            <strong>{recipe.nutrition?.calories ?? 0}</strong>
            <span>Calories</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.protein ?? 0}g</strong>
            <span>Protein</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.carbohydrates ?? 0}g</strong>
            <span>Carbohydrates</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.fat ?? 0}g</strong>
            <span>Fat</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.fiber ?? 0}g</strong>
            <span>Fiber</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.iron ?? 0}mg</strong>
            <span>Iron</span>
          </div>

          <div>
            <strong>{recipe.nutrition?.calcium ?? 0}mg</strong>
            <span>Calcium</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipeDetails;
