function RecipeCard({
  recipe,
  onView,
  image,
  title,
  category,
  time,
  calories,
}) {
  const recipeData = recipe || {
    _id: null,
    image,
    title,
    mealType: category,
    prepTime: parseInt(time) || 0,
    nutrition: {
      calories: parseInt(calories) || 0,
    },
  };

  const titleLower = (recipeData.title || "").toLowerCase();

  // YouTube search URL for this recipe
  const getYouTubeSearchUrl = () => {
    const query = `${recipeData.title || ""} ${
      recipeData.cuisine || ""
    } vegan recipe`;

    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;
  };

  // Use the exact database image first.
  let recipeImage = recipeData.image;

  // Match common recipes with appropriate food images.
  if (!recipeImage) {
    if (
      titleLower.includes("dal") ||
      titleLower.includes("lentil") ||
      titleLower.includes("dal makhni") ||
      titleLower.includes("dal makhani")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";
    } else if (
      titleLower.includes("dumpling") ||
      titleLower.includes("momo")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80";
    } else if (
      titleLower.includes("fried rice") ||
      titleLower.includes("rice bowl")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80";
    } else if (
      titleLower.includes("salad") ||
      titleLower.includes("buddha bowl")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80";
    } else if (
      titleLower.includes("curry") ||
      titleLower.includes("masala")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80";
    } else if (
      titleLower.includes("pasta") ||
      titleLower.includes("spaghetti")
    ) {
      recipeImage =
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80";
    } else if (titleLower.includes("soup")) {
      recipeImage =
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";
    } else {
      // Reliable general vegan-food image
      recipeImage =
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";
    }
  }

  const handleView = () => {
    if (onView && recipeData._id) {
      onView(recipeData._id);
    }
  };

  return (
    <div className="recipe-card">
      <img
        src={recipeImage}
        alt={recipeData.title || "Vegan recipe"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";
        }}
      />

      <div className="recipe-content">
        <span className="recipe-category">
          {recipeData.mealType || recipeData.cuisine || "Vegan"}
        </span>

        <h3>{recipeData.title}</h3>

        <div className="recipe-info">
          <span>⏱ {recipeData.prepTime || 0} min</span>

          <span>
            🔥 {recipeData.nutrition?.calories ?? 0} kcal
          </span>
        </div>

        {onView && recipeData._id && (
          <button
            className="outline-button"
            onClick={handleView}
          >
            View Recipe
          </button>
        )}

        {/* YouTube Recipe Videos */}
        {recipeData.title && (
          <div className="video-section">
            <p>🎥 Want to see how it's prepared?</p>

            <a
              href={getYouTubeSearchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-video-btn"
            >
              ▶ Watch Recipe Videos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;

