import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import RecipeCard from "../components/RecipeCard";

function Home() {
  return (
    <div>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            🌱 Your journey. Your health. Your planet.
          </span>

          <h1>
            Start Your Journey
            <br />
            Towards a <span>Better You.</span>
          </h1>

          <p>
            VeganPath helps you transition to a vegan lifestyle
            with personalized nutrition, delicious recipes,
            meal planning and progress tracking.
          </p>

          <div className="hero-buttons">

            <Link to="/dashboard" className="primary-button">
              Start Your Journey →
            </Link>

            <Link to="/recipes" className="secondary-button">
              Explore Recipes
            </Link>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-circle">
            🌱
          </div>

          <div className="floating-card nutrition-floating">
            <span>🥗</span>
            <div>
              <strong>Balanced Nutrition</strong>
              <small>Personalized for you</small>
            </div>
          </div>

          <div className="floating-card progress-floating">
            <span>🔥</span>
            <div>
              <strong>7 Day Streak</strong>
              <small>Keep going!</small>
            </div>
          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="section">

        <div className="section-heading">

          <span>WHY VEGANPATH?</span>

          <h2>
            Everything You Need
            <br />
            In One Place
          </h2>

          <p>
            We make your transition simple, personalized and sustainable.
          </p>

        </div>

        <div className="feature-grid">

          <FeatureCard
            icon="🥗"
            title="Personalized Nutrition"
            description="Get nutrition guidance based on your lifestyle, goals and journey stage."
          />

          <FeatureCard
            icon="🍲"
            title="Healthy Recipes"
            description="Discover delicious vegan recipes from Indian and global cuisines."
          />

          <FeatureCard
            icon="📅"
            title="Smart Meal Planning"
            description="Plan your meals for the week and stay consistent with your goals."
          />

          <FeatureCard
            icon="💧"
            title="Water Tracking"
            description="Track your daily hydration and build healthy habits."
          />

          <FeatureCard
            icon="📈"
            title="Progress Tracking"
            description="Monitor your journey, streaks, meals and personal milestones."
          />

          <FeatureCard
            icon="🌿"
            title="Ayurvedic Focus"
            description="Explore vegan foods inspired by Ayurvedic principles and Indian traditions."
          />

        </div>

      </section>


      {/* JOURNEY */}

      <section className="journey-section">

        <div className="journey-image">
          <div className="journey-placeholder">
            🌱
          </div>
        </div>

        <div className="journey-content">

          <span className="section-label">
            YOUR PERSONALIZED JOURNEY
          </span>

          <h2>
            Veganism Doesn't Have
            <br />
            To Be Complicated.
          </h2>

          <p>
            Whether you're curious about veganism or already living
            a plant-based lifestyle, VeganPath adapts to your needs.
          </p>

          <div className="journey-step">
            <span>01</span>
            <div>
              <h3>Tell us about yourself</h3>
              <p>
                Set your goals, preferences and current lifestyle.
              </p>
            </div>
          </div>

          <div className="journey-step">
            <span>02</span>
            <div>
              <h3>Get personalized guidance</h3>
              <p>
                Receive nutrition and meal recommendations.
              </p>
            </div>
          </div>

          <div className="journey-step">
            <span>03</span>
            <div>
              <h3>Track your progress</h3>
              <p>
                Build consistency and celebrate milestones.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* RECIPES */}

      <section className="section">

        <div className="section-heading">

          <span>DISCOVER</span>

          <h2>
            Deliciously Vegan
          </h2>

          <p>
            Simple, nutritious and flavorful recipes for every day.
          </p>

        </div>

        <div className="recipe-grid">

          <RecipeCard
            image="https://images.unsplash.com/photo-1547592180-85f173990554"
            title="Rainbow Buddha Bowl"
            category="Lunch"
            time="20 min"
            calories="420"
          />

          <RecipeCard
            image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
            title="Fresh Green Salad"
            category="Healthy"
            time="15 min"
            calories="280"
          />

          <RecipeCard
            image="https://images.unsplash.com/photo-1601050690597-df0568f70950"
            title="Vegetable Dumplings"
            category="Dinner"
            time="35 min"
            calories="390"
          />

        </div>

        <div className="center-button">
          <Link to="/recipes" className="primary-button">
            Explore All Recipes →
          </Link>
        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <div>

          <span>READY TO BEGIN?</span>

          <h2>
            Your Healthier Journey
            <br />
            Starts Today.
          </h2>

          <p>
            Small changes today can create a better tomorrow.
          </p>

          <Link to="/dashboard" className="cta-button">
            Start My Journey →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;