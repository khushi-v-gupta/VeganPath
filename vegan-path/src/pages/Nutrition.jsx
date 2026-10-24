import { useEffect, useState } from "react";
import "./Nutrition.css";
import API_URL from "../api";

function Nutrition() {
  const [nutritionData, setNutritionData] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState("");
  const [selectedMealId, setSelectedMealId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const response = await fetch(`${API_URL}/api/nutrition`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load nutrition data");
        }

        const cuisines = data.nutrition || [];
        setNutritionData(cuisines);

        if (cuisines.length > 0) {
          setSelectedCuisine(cuisines[0].cuisine);
        }
      } catch (err) {
        console.error("NUTRITION FETCH ERROR:", err);
        setError(err.message || "Failed to load nutrition data");
      } finally {
        setLoading(false);
      }
    };

    const fetchMeals = async () => {
      try {
        const response = await fetch(`${API_URL}/api/meals`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load meals");
        }

        const availableMeals = data.meals || [];
        setMeals(availableMeals);

        if (availableMeals.length > 0) {
          setSelectedMealId(availableMeals[0]._id);
        }
      } catch (err) {
        console.error("MEAL FETCH ERROR:", err);
        setMealsError(err.message || "Failed to load meals");
      } finally {
        setMealsLoading(false);
      }
    };

    fetchNutrition();
    fetchMeals();
  }, []);

  const nutrition = nutritionData.find(
    (item) => item.cuisine?.toLowerCase() === selectedCuisine.toLowerCase(),
  );

  const selectedMeal = meals.find((meal) => meal._id === selectedMealId);

  const macros = nutrition
    ? [
        {
          name: "Protein",
          value: nutrition.protein,
          unit: "g",
          percentage: Math.min(Number(nutrition.protein) * 3, 100),
          icon: "💪",
        },
        {
          name: "Carbohydrates",
          value: nutrition.carbohydrates,
          unit: "g",
          percentage: Math.min(Number(nutrition.carbohydrates) * 1.3, 100),
          icon: "🌾",
        },
        {
          name: "Healthy Fats",
          value: nutrition.fat,
          unit: "g",
          percentage: Math.min(Number(nutrition.fat) * 2.5, 100),
          icon: "🥑",
        },
        {
          name: "Fiber",
          value: nutrition.fiber,
          unit: "g",
          percentage: Math.min(Number(nutrition.fiber) * 5, 100),
          icon: "🌱",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="nutrition-page">
        {" "}
        <div className="nutrition-loading">
          {" "}
          <div className="loading-icon">🌱</div>{" "}
          <h2>Preparing your nutrition...</h2>{" "}
          <p>Loading nutrition information</p>{" "}
        </div>{" "}
      </div>
    );
  }

  if (error && nutritionData.length === 0) {
    return (
      <div className="nutrition-page">
        {" "}
        <div className="nutrition-error">
          {" "}
          <div className="error-icon">⚠️</div> <h2>Unable to load nutrition</h2>{" "}
          <p>{error}</p>{" "}
        </div>{" "}
      </div>
    );
  }

  const searchNutrition = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchError("Please enter at least 2 characters.");
      setSearchResults([]);
      setSelectedFood(null);
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    setSelectedFood(null);

    try {
      const response = await fetch(
        `${API_URL}/api/meals/search?q=${encodeURIComponent(query)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to search nutrition.");
      }

      const foods = (data.foods || []).filter(
        (food) =>
          food.calories?.value !== null && food.calories?.value !== undefined,
      );

      setSearchResults(foods);

      if (foods.length === 0) {
        setSearchError(
          "No results with calorie information found. Try another food name.",
        );
      }
    } catch (error) {
      console.error("NUTRITION SEARCH ERROR:", error);
      setSearchError(
        error.message || "Unable to search nutrition. Please try again.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const formatNutrient = (nutrient) => {
    if (nutrient?.value === null || nutrient?.value === undefined) {
      return "Not available";
    }

    return `${nutrient.value} ${nutrient.unit || ""}`.trim();
  };

  return (
    <div className="nutrition-page">
      {/* HERO */}{" "}
      <section className="nutrition-hero">
        {" "}
        <div className="hero-content">
          {" "}
          <span className="eyebrow">VEGAN PATH • NUTRITION</span>{" "}
          <h1>
            Nourish your body, <br /> <span>the plant-powered way.</span>{" "}
          </h1>{" "}
          <p>
            Explore nutritional profiles across cuisines and understand what
            your food brings to your plate.{" "}
          </p>{" "}
        </div>
        <div className="hero-decoration">
          <span>🥑</span>
          <span>🥬</span>
          <span>🫘</span>
          <span>🌱</span>
        </div>
      </section>
      {/* EXISTING CUISINE GUIDE */}
      {nutritionData.length > 0 ? (
        <>
          <section className="cuisine-section">
            <div className="section-title">
              <span>EXPLORE</span>
              <h2>Choose a cuisine</h2>
            </div>

            <div className="cuisine-tabs">
              {nutritionData.map((item) => (
                <button
                  key={item._id}
                  className={
                    selectedCuisine === item.cuisine
                      ? "cuisine-tab active"
                      : "cuisine-tab"
                  }
                  onClick={() => setSelectedCuisine(item.cuisine)}
                >
                  {item.cuisine}
                </button>
              ))}
            </div>
          </section>

          {nutrition && (
            <section className="nutrition-main-card">
              <div className="nutrition-overview">
                <div className="overview-top">
                  <div>
                    <span className="cuisine-label">
                      {selectedCuisine.toUpperCase()} CUISINE
                    </span>
                    <h2>Nutrition Profile</h2>
                    <p>{nutrition.description}</p>
                  </div>

                  <div className="calorie-display">
                    <div className="calorie-number">{nutrition.calories}</div>
                    <div className="calorie-unit">
                      kcal
                      <span>per serving</span>
                    </div>
                  </div>
                </div>

                <div className="macro-grid">
                  {macros.map((macro) => (
                    <div className="macro-card" key={macro.name}>
                      <div className="macro-icon">{macro.icon}</div>
                      <div className="macro-info">
                        <span>{macro.name}</span>
                        <strong>
                          {macro.value}
                          <small>{macro.unit}</small>
                        </strong>
                      </div>
                      <div className="macro-progress">
                        <div style={{ width: `${macro.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="key-nutrients">
                <div className="key-header">
                  <span>ESSENTIAL</span>
                  <h3>Key Nutrients</h3>
                </div>

                {[
                  {
                    name: "Iron",
                    value: nutrition.iron,
                    unit: "mg",
                    icon: "🩸",
                    className: "iron",
                  },
                  {
                    name: "Calcium",
                    value: nutrition.calcium,
                    unit: "mg",
                    icon: "🦴",
                    className: "calcium",
                  },
                  {
                    name: "Protein",
                    value: nutrition.protein,
                    unit: "g",
                    icon: "💪",
                    className: "protein",
                  },
                  {
                    name: "Fiber",
                    value: nutrition.fiber,
                    unit: "g",
                    icon: "🌾",
                    className: "fiber",
                  },
                ].map((item) => (
                  <div className="nutrient-card" key={item.name}>
                    <div className={`nutrient-icon ${item.className}`}>
                      {item.icon}
                    </div>
                    <div>
                      <span>{item.name}</span>
                      <strong>
                        {item.value} {item.unit}
                      </strong>
                      <small>per serving</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="nutrition-empty">
          <div>🥗</div>
          <h2>No cuisine guide available</h2>
          <p>You can still explore the meal nutrition section below.</p>
        </div>
      )}
      {/* NEW MEAL-WISE NUTRITION SECTION */}
      <section className="meal-nutrition-section">
        <div className="section-title">
          <span>MEAL EXPLORER</span>
          <h2>Nutrition for your meal 🍲</h2>
          <p className="meal-section-description">
            Choose a meal to explore its estimated nutrients, serving size and
            ingredients.
          </p>
        </div>

        {mealsLoading ? (
          <div className="meal-message">
            <span>🌱</span>
            <p>Loading meals...</p>
          </div>
        ) : mealsError ? (
          <div className="meal-message meal-error">
            <h3>Unable to load meals</h3>
            <p>{mealsError}</p>
            <button
              className="meal-retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : meals.length === 0 ? (
          <div className="meal-message">
            <span>🥗</span>
            <h3>No meals available yet</h3>
            <p>Meal nutrition information will appear here when available.</p>
          </div>
        ) : (
          <>
            <div className="meal-search-container">
              <form onSubmit={searchNutrition} className="meal-search-form">
                <label htmlFor="meal-search">Search any food or recipe</label>
                
                <div className="meal-search-input-row">
                  <input
                    id="meal-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Try tofu, lentils, chickpeas..."
                    autoComplete="off"
                  />

                  <button type="submit" disabled={searchLoading}>
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </div>
                
              </form>

              {searchError && (
                <p className="meal-search-message" role="status">
                  {searchError}{" "}
                </p>
              )}

              {searchLoading && <p>Searching nutrition database...</p>}

              {searchResults.length > 0 && (
                <div className="meal-search-results">
                  {" "}
                  <h3>Search results</h3>
                  
                  {searchResults.map((food) => (
                    <button
                      type="button"
                      key={food.id}
                      className={
                        selectedFood?.id === food.id
                          ? "meal-search-result active"
                          : "meal-search-result"
                      }
                      onClick={() => setSelectedFood(food)}
                    >
                      <span>{food.name}</span>
                      <span>{formatNutrient(food.calories)} / 100 g</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedFood && (
                <div className="meal-detail-card">
                  {" "}
                  <div className="meal-detail-header">
                    {" "}
                    <div>
                      {" "}
                      <span className="meal-cuisine-label">
                        {selectedFood.dataType}{" "}
                      </span>{" "}
                      <h3>{selectedFood.name}</h3>{" "}
                      <p>
                        Nutrition information from USDA FoodData Central.
                      </p>{" "}
                    </div>
                    
                    <div className="meal-calorie-badge">
                      <strong>{formatNutrient(selectedFood.calories)}</strong>
                      <span>Calories</span>
                    </div>
                  </div>
                  <div className="meal-nutrient-grid">
                    {[
                      {
                        label: "Protein",
                        value: selectedFood.protein,
                        icon: "💪",
                      },
                      {
                        label: "Carbohydrates",
                        value: selectedFood.carbohydrates,
                        icon: "🌾",
                      },
                      {
                        label: "Fat",
                        value: selectedFood.fat,
                        icon: "🥑",
                      },
                      {
                        label: "Fiber",
                        value: selectedFood.fiber,
                        icon: "🌱",
                      },
                      {
                        label: "Iron",
                        value: selectedFood.iron,
                        icon: "🩸",
                      },
                      {
                        label: "Calcium",
                        value: selectedFood.calcium,
                        icon: "🦴",
                      },
                    ].map((item) => (
                      <div className="meal-nutrient-item" key={item.label}>
                        <span className="meal-nutrient-icon">{item.icon}</span>
                        <span className="meal-nutrient-label">
                          {item.label}
                        </span>
                        <strong>{formatNutrient(item.value)}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="meal-estimate-note">
                    Values are based on the selected USDA database entry. They
                    may not represent the nutrition of an entire prepared
                    recipe. Check the selected food's description before using
                    its values.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      {/* BOTTOM CARDS */}
      <section className="nutrition-bottom">
        <div className="nutrition-tip-card">
          <div className="tip-icon">💡</div>
          <div>
            <span>VEGAN PATH TIP</span>
            <h3>Make your nutrients work together</h3>
            <p>
              Pair iron-rich foods such as lentils, beans and spinach with
              vitamin-C-rich foods such as tomatoes, oranges and peppers to
              support iron absorption.
            </p>
          </div>
        </div>

        <div className="nutrition-note-card">
          <div className="note-icon">🌱</div>
          <div>
            <span>YOUR PLANT-BASED JOURNEY</span>
            <h3>Small choices add up</h3>
            <p>
              A balanced variety of legumes, whole grains, vegetables, fruits,
              nuts and seeds can help create diverse plant-based meals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Nutrition;
