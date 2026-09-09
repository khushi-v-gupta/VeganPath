import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>🌱 VeganPath</h2>

          <p>
            Your personalized companion for a healthier,
            sustainable and compassionate lifestyle.
          </p>
        </div>

        <div>
          <h3>Explore</h3>

          <Link to="/recipes">Recipes</Link>
          <Link to="/nutrition">Nutrition</Link>
          <Link to="/meal-planner">Meal Planner</Link>
          <Link to="/ayurveda">Ayurveda</Link>
        </div>

        <div>
          <h3>Your Journey</h3>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/progress">Progress</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 VeganPath. Made with 🌱 for a better tomorrow.</p>
      </div>

    </footer>
  );
}

export default Footer;