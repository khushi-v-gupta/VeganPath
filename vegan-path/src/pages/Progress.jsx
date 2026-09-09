function Progress() {

  return (
    <div className="page-container">

      <div className="page-heading">

        <span>YOUR PROGRESS</span>

        <h1>
          Keep Growing 🌱
        </h1>

        <p>
          Every small step counts. Here's how your journey
          is progressing.
        </p>

      </div>


      <div className="progress-stats">

        <div className="progress-stat">
          <span>🔥</span>
          <strong>7</strong>
          <p>Current Streak</p>
        </div>

        <div className="progress-stat">
          <span>🌱</span>
          <strong>32</strong>
          <p>Total Vegan Days</p>
        </div>

        <div className="progress-stat">
          <span>🥗</span>
          <strong>96</strong>
          <p>Vegan Meals</p>
        </div>

        <div className="progress-stat">
          <span>🏆</span>
          <strong>5</strong>
          <p>Achievements</p>
        </div>

      </div>


      <div className="dashboard-card progress-chart">

        <h2>Weekly Consistency</h2>

        <div className="chart">

          <div style={{ height: "50%" }}>
            <span>Mon</span>
          </div>

          <div style={{ height: "75%" }}>
            <span>Tue</span>
          </div>

          <div style={{ height: "65%" }}>
            <span>Wed</span>
          </div>

          <div style={{ height: "90%" }}>
            <span>Thu</span>
          </div>

          <div style={{ height: "80%" }}>
            <span>Fri</span>
          </div>

          <div style={{ height: "95%" }}>
            <span>Sat</span>
          </div>

          <div style={{ height: "82%" }}>
            <span>Sun</span>
          </div>

        </div>

      </div>


      <div className="achievements">

        <h2>Achievements</h2>

        <div className="achievement-grid">

          <div className="achievement unlocked">
            🥬
            <h3>First Step</h3>
            <p>Completed your first vegan day.</p>
          </div>

          <div className="achievement unlocked">
            🔥
            <h3>Week Warrior</h3>
            <p>Maintained a 7-day streak.</p>
          </div>

          <div className="achievement unlocked">
            💧
            <h3>Hydration Hero</h3>
            <p>Completed your water goal.</p>
          </div>

          <div className="achievement locked">
            🏆
            <h3>30 Day Champion</h3>
            <p>Complete 30 consecutive days.</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Progress;