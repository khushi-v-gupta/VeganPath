import { useState } from "react";

function MealPlanner() {
  const [form, setForm] = useState({
    goal: "maintain",
    age: "",
    gender: "female",
    height: "",
    weight: "",
    activity: "moderate",
    cuisine: "Indian",
    mealsPerDay: "4",
    allergies: "",
    dislikes: "",
    budget: "medium",
    cookingTime: "30",
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setError("");
    setMealPlan(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/meal-plan/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate meal plan");
      }

      setMealPlan(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="meal-planner">

      <div className="page-heading">
        <span>PERSONALIZED MEAL PLANNER</span>

        <h1>
          Your Food.
          <br />
          Your Goals. 🌱
        </h1>

        <p>
          Create a personalized vegan meal plan based on your
          body, lifestyle and food preferences.
        </p>
      </div>

      {/* FORM */}

      <div className="planner-form">

        <h2>Tell us about yourself</h2>

        <div className="form-grid">

          {/* Goal */}
          <div className="form-group">
            <label>Goal</label>

            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintain">Maintain Weight</option>
            </select>
          </div>

          {/* Age */}
          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Height */}
          <div className="form-group">
            <label>Height (cm)</label>

            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="170"
            />
          </div>

          {/* Weight */}
          <div className="form-group">
            <label>Weight (kg)</label>

            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="60"
            />
          </div>

          {/* Activity */}
          <div className="form-group">
            <label>Activity Level</label>

            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
            >
              <option value="sedentary">
                Sedentary
              </option>

              <option value="light">
                Lightly Active
              </option>

              <option value="moderate">
                Moderately Active
              </option>

              <option value="active">
                Very Active
              </option>
            </select>
          </div>

          {/* Cuisine */}
          <div className="form-group">
            <label>Preferred Cuisine</label>

            <select
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
            >
              <option>Indian</option>
              <option>North Indian</option>
              <option>South Indian</option>
              <option>Gujarati</option>
              <option>Mixed</option>
            </select>
          </div>

          {/* Meals */}
          <div className="form-group">
            <label>Meals Per Day</label>

            <select
              name="mealsPerDay"
              value={form.mealsPerDay}
              onChange={handleChange}
            >
              <option value="3">3 Meals</option>
              <option value="4">4 Meals</option>
              <option value="5">5 Meals</option>
            </select>
          </div>

          {/* Budget */}
          <div className="form-group">
            <label>Budget</label>

            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Cooking */}
          <div className="form-group">
            <label>Cooking Time</label>

            <select
              name="cookingTime"
              value={form.cookingTime}
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

        </div>

        {/* Allergies */}

        <div className="form-group full">
          <label>Allergies</label>

          <input
            type="text"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            placeholder="Example: peanuts, soy"
          />
        </div>

        {/* Dislikes */}

        <div className="form-group full">
          <label>Foods You Don't Like</label>

          <input
            type="text"
            name="dislikes"
            value={form.dislikes}
            onChange={handleChange}
            placeholder="Example: broccoli, mushrooms"
          />
        </div>

        <button
          className="generate-btn"
          onClick={generateMealPlan}
          disabled={loading}
        >
          {loading
            ? "Creating Your Plan..."
            : "Generate My Meal Plan 🌱"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* RESULT */}

      {mealPlan && (
        <div className="meal-result">

          <h2>Your Personalized Plan 🌱</h2>

          <div className="nutrition-summary">

            <div>
              <strong>{mealPlan.calories}</strong>
              <span>Calories</span>
            </div>

            <div>
              <strong>{mealPlan.protein}g</strong>
              <span>Protein</span>
            </div>

            <div>
              <strong>{mealPlan.carbs}g</strong>
              <span>Carbs</span>
            </div>

            <div>
              <strong>{mealPlan.fat}g</strong>
              <span>Fat</span>
            </div>

          </div>

          <div className="meals">

            {mealPlan.meals?.map((meal, index) => (

              <div
                className="meal-card"
                key={index}
              >

                <div className="meal-icon">
                  {meal.type === "Breakfast"
                    ? "🌅"
                    : meal.type === "Lunch"
                    ? "🥗"
                    : meal.type === "Snack"
                    ? "🍎"
                    : "🌙"}
                </div>

                <div>

                  <h3>{meal.type}</h3>

                  <h2>{meal.name}</h2>

                  <p>
                    {meal.description}
                  </p>

                  <div className="meal-nutrition">
                    🔥 {meal.calories} kcal
                    &nbsp; | &nbsp;
                    💪 {meal.protein}g protein
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default MealPlanner;