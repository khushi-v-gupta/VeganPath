import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function Dashboard() {
  const { user } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET TODAY'S ACTIVITY
  // =========================

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/activity/today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load activity"
          );
        }

        setActivity(data.activity || data);

      } catch (error) {
        console.error("Activity fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // =========================
  // UPDATE ACTIVITY
  // =========================

  const updateActivity = async (updates) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/activity/today",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update activity"
        );
      }

      setActivity(data.activity || data);

    } catch (error) {
      console.error("Activity update error:", error);
      setError(error.message);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading your Vegan Path... 🌱</h2>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="page-container">
        <h2>Unable to load your progress</h2>
        <p>{error}</p>
      </div>
    );
  }

  // =========================
  // CALCULATE PROGRESS
  // =========================

  const completedGoals = activity?.completedGoals ?? 0;
  const totalGoals = activity?.totalGoals ?? 4;

  const progress =
    totalGoals > 0
      ? Math.round((completedGoals / totalGoals) * 100)
      : 0;

  const water = activity?.water ?? 0;
  const waterGoal = activity?.waterGoal ?? 12;

  console.log("WATER DEBUG:", {
  water: water,
  waterGoal: waterGoal,
  activity: activity
});

  const veganMeals = activity?.veganMeals ?? 0;
  const streak = activity?.streak ?? 0;

  return (
    <div className="dashboard page-container">

      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>
          <span className="section-label">
            MY VEGAN JOURNEY
          </span>

          <h1>
            Good morning
            {user?.name ? `, ${user.name}` : ""}! 🌱
          </h1>

          <p>
            You're doing great. Keep building healthy habits.
          </p>
        </div>

        <div className="streak">
          🔥
          <strong>{streak}</strong>
          <span>Day Streak</span>
        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>🥗</span>
          <strong>{veganMeals}</strong>
          <p>Vegan Meals</p>
        </div>

        <div className="stat-card">
          <span>💧</span>
          <strong>
            {water} / {waterGoal}
          </strong>
          <p>Glasses of Water</p>
        </div>

        <div className="stat-card">
          <span>🔥</span>
          <strong>{streak}</strong>
          <p>Day Streak</p>
        </div>

        <div className="stat-card">
          <span>🌱</span>
          <strong>{progress}%</strong>
          <p>Daily Goal</p>
        </div>

      </div>


      {/* =========================
          DASHBOARD GRID
      ========================= */}

      <div className="dashboard-grid">

        <div className="dashboard-main">

          {/* =========================
              TODAY'S PROGRESS
          ========================= */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>
                <h2>Today's Progress</h2>

                <p>
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <span>{progress}%</span>

            </div>


            {/* PROGRESS BAR */}

            <div className="progress-bar">

              <div
                style={{
                  width: `${progress}%`,
                }}
              ></div>

            </div>


            {/* GOALS */}

            <div className="goal-list">

              <div>
                <span>🥗</span>

                <p>
                  Eat vegan meals
                </p>

                <strong>
                  {veganMeals > 0 ? "✓" : "○"}
                </strong>
              </div>


              <div>
                <span>💧</span>

                <p>
                  Drink 12 glasses of water
                </p>

                <strong>
                  {water}/{waterGoal}
                </strong>
              </div>


              <div>
                <span>🚶</span>

                <p>
                  30 minutes activity
                </p>

                <strong>
                  {activity?.exercise
                    ? "✓"
                    : "○"}
                </strong>
              </div>


              <div>
                <span>📚</span>

                <p>
                  Learn something new
                </p>

                <strong>
                  {activity?.learning
                    ? "✓"
                    : "○"}
                </strong>
              </div>

            </div>


            {/* =========================
                ACTIVITY BUTTONS
            ========================= */}

            <div className="activity-buttons">

              {/* WATER */}

              <button
                onClick={() =>
                  updateActivity({
                    water: Math.min(
                      water + 1,
                      waterGoal
                    ),
                  })
                }
                disabled={water >= waterGoal}
              >
                💧{" "}
                {water >= waterGoal
                  ? "Water Goal Completed"
                  : "Add Water"}
              </button>


              {/* VEGAN MEAL */}

              <button
                onClick={() =>
                  updateActivity({
                    veganMeals:
                      veganMeals + 1,
                  })
                }
              >
                🥗 Add Vegan Meal
              </button>


              {/* ACTIVITY */}

              <button
                onClick={() => {

                  const completed =
                    activity?.exercise;

                  updateActivity({

                    exercise:
                      !completed,

                    completedGoals:
                      completed
                        ? Math.max(
                            completedGoals - 1,
                            0
                          )
                        : Math.min(
                            completedGoals + 1,
                            totalGoals
                          ),

                  });

                }}
              >
                {activity?.exercise
                  ? "✅ Activity Completed"
                  : "🚶 Complete Activity"}
              </button>


              {/* LEARNING */}

              <button
                onClick={() => {

                  const completed =
                    activity?.learning;

                  updateActivity({

                    learning:
                      !completed,

                    completedGoals:
                      completed
                        ? Math.max(
                            completedGoals - 1,
                            0
                          )
                        : Math.min(
                            completedGoals + 1,
                            totalGoals
                          ),

                  });

                }}
              >
                {activity?.learning
                  ? "✅ Learning Completed"
                  : "📚 Complete Learning"}
              </button>

            </div>

          </div>


          {/* =========================
              TODAY'S MEALS
          ========================= */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>
                <h2>Today's Meals</h2>

                <p>
                  Your personalized meal plan
                </p>
              </div>

              <Link to="/meal-planner">
                View Plan →
              </Link>

            </div>


            <div className="meal-row">

              <div className="meal-icon">
                🌅
              </div>

              <div>
                <span>BREAKFAST</span>

                <h3>
                  Oatmeal with Banana & Nuts
                </h3>

                <p>
                  380 kcal • Protein 12g
                </p>
              </div>

              <strong>✓</strong>

            </div>


            <div className="meal-row">

              <div className="meal-icon">
                ☀️
              </div>

              <div>
                <span>LUNCH</span>

                <h3>
                  Chickpea Buddha Bowl
                </h3>

                <p>
                  450 kcal • Protein 18g
                </p>
              </div>

              <strong>✓</strong>

            </div>


            <div className="meal-row">

              <div className="meal-icon">
                🌙
              </div>

              <div>
                <span>DINNER</span>

                <h3>
                  Palak Tofu with Roti
                </h3>

                <p>
                  420 kcal • Protein 22g
                </p>
              </div>

              <strong>○</strong>

            </div>

          </div>

        </div>


        {/* =========================
            SIDEBAR
        ========================= */}

        <aside>

          {/* RECOMMENDATION */}

          <div className="dashboard-card recommendation">

            <span>
              ✨ RECOMMENDED FOR YOU
            </span>

            <h2>
              Boost Your Iron
            </h2>

            <p>
              Try adding spinach, lentils and
              pumpkin seeds to your meals this week.
            </p>

            <Link to="/nutrition">
              Learn More →
            </Link>

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-card">

            <h2>
              Quick Actions
            </h2>

            <Link
              to="/recipes"
              className="quick-action"
            >
              🍲 Find a Recipe
            </Link>

            <Link
              to="/meal-planner"
              className="quick-action"
            >
              📅 Plan My Meals
            </Link>

            <Link
              to="/nutrition"
              className="quick-action"
            >
              🥗 Check Nutrition
            </Link>

            <Link
              to="/progress"
              className="quick-action"
            >
              📈 View Progress
            </Link>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Dashboard;