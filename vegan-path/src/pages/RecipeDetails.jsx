import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RecipeDetails.css";

function RecipeDetails() {
const { id } = useParams();
const navigate = useNavigate();

const [recipe, setRecipe] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchRecipe = async () => {
try {
setLoading(true);
setError("");


    const response = await fetch(
      `http://localhost:5000/api/recipes/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load recipe"
      );
    }

    setRecipe(data);
  } catch (error) {
    console.error("RECIPE DETAILS ERROR:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

if (id) {
  fetchRecipe();
}


}, [id]);

if (loading) {
return ( <div className="recipe-details-page"> <div className="recipe-details-loading">
🌱 Loading recipe... </div> </div>
);
}

if (error) {
return ( <div className="recipe-details-page"> <div className="recipe-details-error"> <div className="recipe-error-icon">⚠️</div>


      <h2>Unable to load recipe</h2>

      <p>{error}</p>

      <button
        className="back-button"
        onClick={() => navigate("/recipes")}
      >
        ← Back to Recipes
      </button>
    </div>
  </div>
);


}

if (!recipe) {
return null;
}

return ( <div className="recipe-details-page">

```
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
        <img
          src={recipe.image}
          alt={recipe.title}
        />
      ) : (
        <div className="recipe-image-placeholder">
          🥗
        </div>
      )}
    </div>

    <div className="recipe-details-intro">

      <span className="recipe-details-badge">
        {recipe.cuisine}
      </span>

      <h1>{recipe.title}</h1>

      {recipe.description && (
        <p className="recipe-description">
          {recipe.description}
        </p>
      )}

      <div className="recipe-meta">

        <div>
          <span>⏱</span>
          <strong>
            {recipe.prepTime || 0} min
          </strong>
          <small>Prep Time</small>
        </div>

        <div>
          <span>📊</span>
          <strong>
            {recipe.difficulty || "Easy"}
          </strong>
          <small>Difficulty</small>
        </div>

        <div>
          <span>🍽️</span>
          <strong>
            {recipe.mealType}
          </strong>
          <small>Meal Type</small>
        </div>

        <div>
          <span>🔥</span>
          <strong>
            {recipe.nutrition?.calories ?? 0}
          </strong>
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
        {recipe.ingredients?.map(
          (ingredient, index) => (
            <li key={ingredient._id || index}>
              <span className="ingredient-dot">
                ✓
              </span>

              <span>
                <strong>
                  {ingredient.quantity}
                </strong>{" "}
                {ingredient.name}
              </span>
            </li>
          )
        )}
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
        {recipe.instructions?.map(
          (instruction, index) => (
            <li key={index}>
              <span className="instruction-number">
                {index + 1}
              </span>

              <p>{instruction}</p>
            </li>
          )
        )}
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
        <strong>
          {recipe.nutrition?.calories ?? 0}
        </strong>
        <span>Calories</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.protein ?? 0}g
        </strong>
        <span>Protein</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.carbohydrates ?? 0}g
        </strong>
        <span>Carbohydrates</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.fat ?? 0}g
        </strong>
        <span>Fat</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.fiber ?? 0}g
        </strong>
        <span>Fiber</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.iron ?? 0}mg
        </strong>
        <span>Iron</span>
      </div>

      <div>
        <strong>
          {recipe.nutrition?.calcium ?? 0}mg
        </strong>
        <span>Calcium</span>
      </div>

    </div>
  </section>

</div>


);
}

export default RecipeDetails;
