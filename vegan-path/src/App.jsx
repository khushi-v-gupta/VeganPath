import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Nutrition from "./pages/Nutrition";
import MealPlanner from "./pages/MealPlanner";
import Progress from "./pages/Progress";
import Ayurveda from "./pages/Ayurveda";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import FoodScanner from "./components/FoodScanner";
import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ayurveda" element={<Ayurveda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </main>

      <Footer />
      <FoodScanner />
    </>
  );
}

export default App;
