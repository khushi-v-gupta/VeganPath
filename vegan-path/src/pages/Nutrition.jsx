import { useEffect, useState } from "react";

function Nutrition() {
  const [nutritionData, setNutritionData] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH NUTRITION DATA
  // ==========================================

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

        // Backend returns { nutrition: [...] }
        setNutritionData(data.nutrition || []);

        // Select first cuisine automatically
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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-container">

        <div className="page-heading">

          <span>PERSONALIZED NUTRITION</span>

          <h1>
            Nourish Your Body 🌱
          </h1>

          <p>
            Loading nutrition data...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="page-container">

        <div className="page-heading">

          <span>PERSONALIZED NUTRITION</span>

          <h1>
            Nourish Your Body 🌱
          </h1>

          <p>
            Unable to load nutrition data.
          </p>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // NO DATA
  // ==========================================

  if (nutritionData.length === 0) {
    return (
      <div className="page-container">

        <div className="page-heading">

          <span>PERSONALIZED NUTRITION</span>

          <h1>
            Nourish Your Body 🌱
          </h1>

          <p>
            No nutrition data is available yet.
          </p>

        </div>

        <div className="info-card">

          <div>
            <span>🥗</span>
          </div>

          <div>

            <h2>
              Nutrition data not found
            </h2>

            <p>
              Add nutrition profiles to your MongoDB
              Nutrition collection to display them here.
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // FIND SELECTED CUISINE
  // ==========================================

  const nutrition = nutritionData.find(
    (item) =>
      item.cuisine.toLowerCase() ===
      selectedCuisine.toLowerCase()
  );


  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!nutrition) {
    return (
      <div className="page-container">

        <div className="page-heading">

          <h1>
            Nutrition data unavailable 🌱
          </h1>

        </div>

      </div>
    );
  }


  return (
    <div className="page-container">

      {/* ==========================================
          PAGE HEADING
      ========================================== */}

      <div className="page-heading">

        <span>
          PERSONALIZED NUTRITION
        </span>

        <h1>
          Nourish Your Body 🌱
        </h1>

        <p>
          Explore nutritional values across different
          vegan cuisines and understand what your body needs.
        </p>

      </div>


      {/* ==========================================
          CUISINE SELECTOR
      ========================================== */}

      <div className="cuisine-selector">

        <h2>
          Explore Cuisine Nutrition
        </h2>

        <div className="category-buttons">

          {nutritionData.map((item) => (

            <button
              key={item._id}
              className={
                selectedCuisine === item.cuisine
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCuisine(item.cuisine)
              }
            >
              {item.cuisine}
            </button>

          ))}

        </div>

      </div>


      {/* ==========================================
          SELECTED CUISINE
      ========================================== */}

      <div className="nutrition-summary">

        <div className="nutrition-main">

          <span className="section-label">
            {selectedCuisine.toUpperCase()} CUISINE
          </span>

          <h2>
            Nutritional Profile
          </h2>

          <div className="calorie-circle">

            <strong>
              {nutrition.calories}
            </strong>

            <span>
              kcal
            </span>

          </div>


          {/* ==========================================
              MACROS
          ========================================== */}

          <div className="macro-grid">

            {/* PROTEIN */}

            <div>

              <span>
                Protein
              </span>

              <strong>
                {nutrition.protein}g
              </strong>

              <div className="small-progress">

                <div
                  style={{
                    width: `${Math.min(
                      nutrition.protein * 3,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* CARBOHYDRATES */}

            <div>

              <span>
                Carbohydrates
              </span>

              <strong>
                {nutrition.carbohydrates}g
              </strong>

              <div className="small-progress">

                <div
                  style={{
                    width: `${Math.min(
                      nutrition.carbohydrates * 1.3,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* FAT */}

            <div>

              <span>
                Fats
              </span>

              <strong>
                {nutrition.fat}g
              </strong>

              <div className="small-progress">

                <div
                  style={{
                    width: `${Math.min(
                      nutrition.fat * 2.5,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* FIBER */}

            <div>

              <span>
                Fiber
              </span>

              <strong>
                {nutrition.fiber}g
              </strong>

              <div className="small-progress">

                <div
                  style={{
                    width: `${Math.min(
                      nutrition.fiber * 5,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            IMPORTANT NUTRIENTS
        ========================================== */}

        <div className="nutrition-side">

          <h2>
            Important Nutrients
          </h2>


          {/* IRON */}

          <div className="nutrient-item">

            <span>
              🩸
            </span>

            <div>

              <strong>
                Iron
              </strong>

              <p>
                {nutrition.iron} mg per serving
              </p>

            </div>

          </div>


          {/* CALCIUM */}

          <div className="nutrient-item">

            <span>
              🦴
            </span>

            <div>

              <strong>
                Calcium
              </strong>

              <p>
                {nutrition.calcium} mg per serving
              </p>

            </div>

          </div>


          {/* PROTEIN */}

          <div className="nutrient-item">

            <span>
              💪
            </span>

            <div>

              <strong>
                Protein
              </strong>

              <p>
                {nutrition.protein}g per serving
              </p>

            </div>

          </div>


          {/* FIBER */}

          <div className="nutrient-item">

            <span>
              🌾
            </span>

            <div>

              <strong>
                Fiber
              </strong>

              <p>
                {nutrition.fiber}g per serving
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          CUISINE DESCRIPTION
      ========================================== */}

      <div className="info-card">

        <div>
          <span>🌾</span>
        </div>

        <div>

          <h2>
            Why {selectedCuisine} Cuisine?
          </h2>

          <p>
            {nutrition.description}
          </p>

        </div>

      </div>


      {/* ==========================================
          PERSONALIZED TIP
      ========================================== */}

      <div className="info-card">

        <div>
          <span>💡</span>
        </div>

        <div>

          <h2>
            Personalized Tip
          </h2>

          <p>
            Pairing iron-rich foods such as lentils,
            beans and spinach with vitamin-C-rich foods
            such as tomatoes, oranges and peppers can
            help improve iron absorption.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Nutrition;