function RecipeCard({ image, title, category, time, calories }) {
  return (
    <div className="recipe-card">

      <img src={image} alt={title} />

      <div className="recipe-content">

        <span className="recipe-category">
          {category}
        </span>

        <h3>{title}</h3>

        <div className="recipe-info">
          <span>⏱ {time}</span>
          <span>🔥 {calories} kcal</span>
        </div>

        <button className="outline-button">
          View Recipe
        </button>

      </div>

    </div>
  );
}

export default RecipeCard;