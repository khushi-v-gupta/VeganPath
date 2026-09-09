import { useState } from "react";

function Ayurveda() {
  const [dosha, setDosha] = useState("");

  const doshas = {
    Vata: {
      title: "Vata",
      description:
        "Vata is associated with movement, air, and space. A balanced Vata-friendly diet generally focuses on warm, nourishing and easy-to-digest foods.",
      foods: [
        "Warm cooked vegetables",
        "Oats",
        "Rice",
        "Sweet potatoes",
        "Dates",
        "Almonds",
        "Sesame"
      ]
    },

    Pitta: {
      title: "Pitta",
      description:
        "Pitta is associated with fire and transformation. Cooling, hydrating and less spicy plant-based foods can be suitable for a Pitta-oriented lifestyle.",
      foods: [
        "Cucumber",
        "Coconut",
        "Leafy greens",
        "Melons",
        "Rice",
        "Coriander",
        "Mint"
      ]
    },

    Kapha: {
      title: "Kapha",
      description:
        "Kapha is associated with stability and earth/water elements. Light, warm and moderately spiced plant foods can support a balanced lifestyle.",
      foods: [
        "Leafy vegetables",
        "Lentils",
        "Chickpeas",
        "Millets",
        "Ginger",
        "Black pepper",
        "Turmeric"
      ]
    }
  };

  return (
    <div className="ayurveda-page">
      <section className="ayurveda-hero">
        <h1>Ayurvedic Vegan Wellness</h1>

        <p>
          Discover plant-based foods and wellness practices inspired by
          Ayurvedic principles.
        </p>
      </section>

      <section className="dosha-section">
        <h2>Explore Your Dosha</h2>

        <p>
          Select a dosha to explore general food suggestions.
        </p>

        <div className="dosha-buttons">
          <button onClick={() => setDosha("Vata")}>
            Vata
          </button>

          <button onClick={() => setDosha("Pitta")}>
            Pitta
          </button>

          <button onClick={() => setDosha("Kapha")}>
            Kapha
          </button>
        </div>

        {dosha && (
          <div className="dosha-card">
            <h2>{doshas[dosha].title}</h2>

            <p>{doshas[dosha].description}</p>

            <h3>Suggested Plant Foods</h3>

            <ul>
              {doshas[dosha].foods.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="ayurveda-features">
        <h2>Vegan Path Ayurvedic Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🌿 Dosha Guidance</h3>
            <p>
              Explore general food suggestions based on Vata, Pitta and
              Kapha concepts.
            </p>
          </div>

          <div className="feature-card">
            <h3>🍛 Indian Foods</h3>
            <p>
              Discover plant-based Indian ingredients and traditional meal
              ideas.
            </p>
          </div>

          <div className="feature-card">
            <h3>🧘 Wellness</h3>
            <p>
              Learn about simple lifestyle practices inspired by Ayurveda.
            </p>
          </div>

          <div className="feature-card">
            <h3>🥗 Personalized Recipes</h3>
            <p>
              Connect Ayurvedic preferences with Vegan Path's AI recipe
              generator.
            </p>
          </div>
        </div>
      </section>

      <section className="ayurveda-note">
        <h2>Important Note</h2>

        <p>
          Ayurvedic concepts are traditional wellness practices and should
          not be treated as a substitute for professional medical advice.
          Individual dietary needs can vary.
        </p>
      </section>
    </div>
  );
}

export default Ayurveda;