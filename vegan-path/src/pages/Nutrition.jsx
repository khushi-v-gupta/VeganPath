import { useEffect, useState } from "react";
import "./Nutrition.css";

function Nutrition() {
  const [nutritionData, setNutritionData] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/nutrition"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load nutrition data"
          );
        }

        setNutritionData(data.nutrition || []);

        if (data.nutrition && data.nutrition.length > 0) {
          setSelectedCuisine(data.nutrition[0].cuisine);
        }
      } catch (error) {
        console.error("NUTRITION FETCH ERROR:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, []);

  if (loading) {
    return (
      <div className="nutrition-page">
        <div className="nutrition-loading">
          <div className="loading-icon">🌱</div>
          <h2>Preparing your nutrition...</h2>
          <p>Loading personalized nutrition information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nutrition-page">
        <div className="nutrition-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load nutrition</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (nutritionData.length === 0) {
    return (
      <div className="nutrition-page">
        <div className="nutrition-empty">
          <div>🥗</div>
          <h2>No nutrition data available</h2>
          <p>
            Nutrition information will appear here once data is
            available.
          </p>
        </div>
      </div>
    );
  }

  const nutrition = nutritionData.find(
    (item) =>
      item.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
  );

  if (!nutrition) return null;

  const macros = [
    {
      name: "Protein",
      value: nutrition.protein,
      unit: "g",
      percentage: Math.min(nutrition.protein * 3, 100),
      icon: "💪",
    },
    {
      name: "Carbohydrates",
      value: nutrition.carbohydrates,
      unit: "g",
      percentage: Math.min(nutrition.carbohydrates * 1.3, 100),
      icon: "🌾",
    },
    {
      name: "Healthy Fats",
      value: nutrition.fat,
      unit: "g",
      percentage: Math.min(nutrition.fat * 2.5, 100),
      icon: "🥑",
    },
    {
      name: "Fiber",
      value: nutrition.fiber,
      unit: "g",
      percentage: Math.min(nutrition.fiber * 5, 100),
      icon: "🌱",
    },
  ];

  return (
    <div className="nutrition-page">

      {/* HERO */}
      <section className="nutrition-hero">
        <div className="hero-content">
          <span className="eyebrow">VEGAN PATH • NUTRITION</span>

          <h1>
            Nourish your body,
            <br />
            <span>the plant-powered way.</span>
          </h1>

          <p>
            Explore nutritional profiles across cuisines and
            understand what your food brings to your plate.
          </p>
        </div>

        <div className="hero-decoration">
          <span>🥑</span>
          <span>🥬</span>
          <span>🫘</span>
          <span>🌱</span>
        </div>
      </section>

      {/* CUISINE TABS */}
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

      {/* MAIN NUTRITION CARD */}
      <section className="nutrition-main-card">

        {/* LEFT */}
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
              <div className="calorie-number">
                {nutrition.calories}
              </div>

              <div className="calorie-unit">
                kcal
                <span>per serving</span>
              </div>
            </div>
          </div>

          {/* MACROS */}
          <div className="macro-grid">
            {macros.map((macro) => (
              <div className="macro-card" key={macro.name}>

                <div className="macro-icon">
                  {macro.icon}
                </div>

                <div className="macro-info">
                  <span>{macro.name}</span>

                  <strong>
                    {macro.value}
                    <small>{macro.unit}</small>
                  </strong>
                </div>

                <div className="macro-progress">
                  <div
                    style={{
                      width: `${macro.percentage}%`,
                    }}
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="key-nutrients">

          <div className="key-header">
            <span>ESSENTIAL</span>
            <h3>Key Nutrients</h3>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon iron">
              🩸
            </div>

            <div>
              <span>Iron</span>
              <strong>{nutrition.iron} mg</strong>
              <small>per serving</small>
            </div>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon calcium">
              🦴
            </div>

            <div>
              <span>Calcium</span>
              <strong>{nutrition.calcium} mg</strong>
              <small>per serving</small>
            </div>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon protein">
              💪
            </div>

            <div>
              <span>Protein</span>
              <strong>{nutrition.protein} g</strong>
              <small>per serving</small>
            </div>
          </div>

          <div className="nutrient-card">
            <div className="nutrient-icon fiber">
              🌾
            </div>

            <div>
              <span>Fiber</span>
              <strong>{nutrition.fiber} g</strong>
              <small>per serving</small>
            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM CARDS */}
      <section className="nutrition-bottom">

        <div className="nutrition-tip-card">
          <div className="tip-icon">💡</div>

          <div>
            <span>VEGAN PATH TIP</span>

            <h3>Make your nutrients work together</h3>

            <p>
              Pair iron-rich foods such as lentils, beans and
              spinach with vitamin-C-rich foods such as tomatoes,
              oranges and peppers to support iron absorption.
            </p>
          </div>
        </div>

        <div className="nutrition-note-card">
          <div className="note-icon">🌱</div>

          <div>
            <span>YOUR PLANT-BASED JOURNEY</span>

            <h3>Small choices add up</h3>

            <p>
              A balanced variety of legumes, whole grains,
              vegetables, fruits, nuts and seeds can help create
              diverse plant-based meals.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Nutrition;
