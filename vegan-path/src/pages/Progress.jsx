
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const achievementList = [
  {
    icon: "🥬",
    title: "First Step",
    description: "Complete your first vegan day.",
    requirement: 1,
  },
  {
    icon: "🔥",
    title: "Week Warrior",
    description: "Maintain a 7-day streak.",
    requirement: 7,
  },
  {
    icon: "🥗",
    title: "Meal Master",
    description: "Log 30 vegan meals.",
    requirement: 30,
  },
  {
    icon: "🏆",
    title: "30 Day Champion",
    description: "Maintain a 30-day streak.",
    requirement: 30,
  },
];

function Progress() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your progress.");
        }

        const response = await fetch(
          `${API_URL}/api/activity/today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your progress."
          );
        }

        setActivity(data.activity || data);
      } catch (err) {
        console.error("Progress error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading your progress... 🌱</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>Unable to load your progress</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const streak = Number(activity?.streak) || 0;
  const veganMeals = Number(activity?.veganMeals) || 0;

  // These values require historical activity data from the backend.
  const totalVeganDays = Number(activity?.totalVeganDays) || 0;
  const weeklyActivity = Array.isArray(activity?.weeklyActivity)
    ? activity.weeklyActivity
    : [];

  const achievements = achievementList.map((item) => ({
    ...item,
    unlocked:
      item.title === "First Step"
        ? totalVeganDays >= item.requirement
        : item.title === "Week Warrior"
        ? streak >= item.requirement
        : item.title === "Meal Master"
        ? veganMeals >= item.requirement
        : streak >= item.requirement,
  }));

  const unlockedAchievements = achievements.filter(
    (item) => item.unlocked
  ).length;

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="page-container">
      <div className="page-heading">
        <span>YOUR PROGRESS</span>

        <h1>Keep Growing 🌱</h1>

        <p>
          Every small step counts. Here's how your journey
          is progressing.
        </p>
      </div>

      {/* PROGRESS STATISTICS */}

      <div className="progress-stats">
        <div className="progress-stat">
          <span>🔥</span>
          <strong>{streak}</strong>
          <p>Current Streak</p>
        </div>

        <div className="progress-stat">
          <span>🌱</span>
          <strong>{totalVeganDays}</strong>
          <p>Total Vegan Days</p>
        </div>

        <div className="progress-stat">
          <span>🥗</span>
          <strong>{veganMeals}</strong>
          <p>Vegan Meals</p>
        </div>

        <div className="progress-stat">
          <span>🏆</span>
          <strong>{unlockedAchievements}</strong>
          <p>Achievements</p>
        </div>
      </div>

      {/* WEEKLY CONSISTENCY */}

      <div className="dashboard-card progress-chart">
        <h2>Weekly Consistency</h2>

        {weeklyActivity.length === 0 ? (
          <p>
            Your weekly chart will appear when historical
            activity tracking is available.
          </p>
        ) : (
          <div className="chart">
            {weekDays.map((day) => {
              const record = weeklyActivity.find(
                (item) => item.day === day
              );

              const percentage = Math.min(
                100,
                Math.max(0, Number(record?.percentage) || 0)
              );

              return (
                <div
                  key={day}
                  style={{
                    height: `${Math.max(percentage, 5)}%`,
                  }}
                  title={`${day}: ${percentage}%`}
                >
                  <span>{day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACHIEVEMENTS */}

      <div className="achievements">
        <h2>Achievements</h2>

        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`achievement ${
                achievement.unlocked ? "unlocked" : "locked"
              }`}
            >
              <span>{achievement.icon}</span>

              <h3>{achievement.title}</h3>

              <p>{achievement.description}</p>

              <small>
                {achievement.unlocked
                  ? "✅ Unlocked"
                  : "🔒 Locked"}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Progress;

