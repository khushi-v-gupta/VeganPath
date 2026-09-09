import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        🌱 Vegan<span>Path</span>
      </Link>

      <div className="nav-links">

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/recipes">
          Recipes
        </NavLink>

        <NavLink to="/nutrition">
          Nutrition
        </NavLink>

        <NavLink to="/meal-planner">
          Meal Planner
        </NavLink>

        <NavLink to="/ayurveda">
          Ayurveda
        </NavLink>

      </div>

      <div className="nav-auth">

        {isLoggedIn ? (
          <>
            <span className="nav-user">
              👋 {user?.name || "User"}
            </span>

            <Link
              to="/dashboard"
              className="nav-button"
            >
              My Journey
            </Link>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="nav-button"
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;