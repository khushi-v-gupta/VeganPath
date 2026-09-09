import { useState } from "react";

function Ayurveda() {
  const [medicine, setMedicine] = useState("");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMedicine = async () => {
    if (!medicine.trim()) {
      setError("Please enter a medicine name");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ayurveda/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicine,
            language,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Medicine not found");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <span>AYURVEDA & VEGANISM</span>

        <h1>
          Ancient Wisdom,
          <br />
          Plant-Based Living 🌿
        </h1>

        <p>
          Explore Ayurvedic medicines and traditional knowledge in your own
          language.
        </p>
      </div>

      {/* SEARCH */}

      <div className="ayurveda-search">
        <input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMedicine();
            }
          }}
          placeholder="Search medicine in any language..."
        />

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {/* International */}
          <option value="English">🇬🇧 English</option>
          <option value="Spanish">🇪🇸 Spanish</option>
          <option value="French">🇫🇷 French</option>
          <option value="German">🇩🇪 German</option>
          <option value="Portuguese">🇵🇹 Portuguese</option>
          <option value="Italian">🇮🇹 Italian</option>
          <option value="Russian">🇷🇺 Russian</option>
          <option value="Chinese">🇨🇳 Chinese</option>
          <option value="Japanese">🇯🇵 Japanese</option>
          <option value="Korean">🇰🇷 Korean</option>
          <option value="Arabic">🇸🇦 Arabic</option>

          {/* Indian */}
          <option value="Hindi">🇮🇳 Hindi</option>
          <option value="Sanskrit">🕉️ Sanskrit</option>
          <option value="Marathi">🇮🇳 Marathi</option>
          <option value="Gujarati">🇮🇳 Gujarati</option>
          <option value="Bengali">🇮🇳 Bengali</option>
          <option value="Tamil">🇮🇳 Tamil</option>
          <option value="Telugu">🇮🇳 Telugu</option>
          <option value="Kannada">🇮🇳 Kannada</option>
          <option value="Malayalam">🇮🇳 Malayalam</option>
          <option value="Punjabi">🇮🇳 Punjabi</option>
        </select>

        <button onClick={searchMedicine}>
          {loading ? "Searching..." : "Search 🌿"}
        </button>
      </div>

      {/* ERROR */}

      {error && <div className="error-message">{error}</div>}

      {/* RESULT */}

      {result && (
        <div className="ayurveda-result">
          <div className="medicine-header">
            <span>🌿 AYURVEDA</span>

            <h2>{result.name}</h2>

            <p>{result.sanskritName}</p>
          </div>

          <section>
            <h3>🌿 What is it?</h3>
            <p>{result.description}</p>
          </section>

          <section>
            <h3>🧪 Ingredients</h3>

            <ul>
              {result.ingredients?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>💚 Traditional Ayurvedic Uses</h3>

            <ul>
              {result.uses?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>✨ Traditional Benefits</h3>

            <ul>
              {result.benefits?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>💊 Forms</h3>

            <p>{result.forms?.join(", ")}</p>
          </section>

          <section>
            <h3>⚠️ Precautions</h3>

            <ul>
              {result.precautions?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>🔄 Interactions</h3>

            <p>{result.interactions}</p>
          </section>

          <section>
            <h3>📌 Traditional Ayurvedic Usage</h3>

            <p>{result.traditionalUsage}</p>
          </section>

          <div className="medical-warning">
            ⚠️ <strong>Important:</strong>
            <p>
              This information is provided for educational purposes and should
              not replace advice from a qualified healthcare professional. Do
              not self-medicate based only on this information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ayurveda;
