import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import API_URL from "../api";

function Recipes() {
  const getYouTubeSearchUrl = (recipe) => {
    const query = `${recipe.title} ${recipe.cuisine || ""} vegan recipe`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [mealType, setMealType] = useState("Dinner");
  const [goal, setGoal] = useState("High Protein");
  const [calories, setCalories] = useState(500);

  const [aiRecipe, setAiRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dailyRecipe, setDailyRecipe] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [nutritionData, setNutritionData] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(true);

  const [recipes, setRecipes] = useState([]);

  const defaultRecipes = [
    {
      _id: "default-1",
      title: "Indian Chickpea Curry",
      cuisine: "Indian",
      mealType: "Lunch",
      prepTime: 30,
      difficulty: "Easy",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR75BFqWAUFBh6zh6BYfEuQ8u3QWN6hqhK_uHOuvWJKw&s=10",
      description:
        "A comforting Indian chickpea curry made with tomatoes and aromatic spices.",
      nutrition: { calories: 280, protein: 12 },
      ingredients: [
        { name: "Boiled chickpeas", quantity: "1.5 cups" },
        { name: "Onion", quantity: "1 medium, chopped" },
        { name: "Tomatoes", quantity: "2 medium, chopped" },
        { name: "Garlic", quantity: "3 cloves, minced" },
        { name: "Ginger", quantity: "1 tsp, grated" },
        { name: "Cooking oil", quantity: "1 tbsp" },
        { name: "Cumin", quantity: "1 tsp" },
        { name: "Coriander powder", quantity: "1 tsp" },
        { name: "Turmeric", quantity: "1/4 tsp" },
        { name: "Garam masala", quantity: "1/2 tsp" },
        { name: "Salt", quantity: "To taste" },
      ],
      instructions: [
        "Heat oil in a pan over medium heat.",
        "Add cumin seeds and let them sizzle briefly.",
        "Add chopped onion and cook until golden.",
        "Add garlic and ginger, then sauté for 30 seconds.",
        "Add tomatoes, turmeric, coriander powder, and salt. Cook until the tomatoes soften.",
        "Add boiled chickpeas and half a cup of water.",
        "Simmer for 10–15 minutes, stirring occasionally.",
        "Add garam masala, mix well, and serve hot.",
      ],
    },
    {
      _id: "default-2",
      title: "Asian Tofu Stir-Fry",
      cuisine: "Asian",
      mealType: "Dinner",
      prepTime: 25,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIoyRMWFhyR29CwrvkeDniP2Xo8Ncnavnwh-UEJf2dwg&s=10",
      description:
        "Tofu stir-fried with colourful vegetables and a savoury soy sauce.",
      nutrition: { calories: 320, protein: 18 },
      ingredients: [
        { name: "Firm tofu", quantity: "200 g, cubed" },
        { name: "Broccoli", quantity: "1 cup" },
        { name: "Bell pepper", quantity: "1 medium, sliced" },
        { name: "Carrot", quantity: "1 medium, sliced" },
        { name: "Soy sauce", quantity: "2 tbsp" },
        { name: "Garlic", quantity: "2 cloves, minced" },
        { name: "Ginger", quantity: "1 tsp, grated" },
        { name: "Cooking oil", quantity: "1 tbsp" },
      ],
      instructions: [
        "Press the tofu to remove excess water and cut it into cubes.",
        "Wash and slice the vegetables.",
        "Heat half the oil in a pan and cook the tofu until golden. Set aside.",
        "Add the remaining oil, garlic, and ginger to the pan.",
        "Add the vegetables and stir-fry for 4–5 minutes.",
        "Return the tofu to the pan and add soy sauce.",
        "Toss everything together and cook for another 2–3 minutes.",
        "Serve hot with rice or noodles.",
      ],
    },
    {
      _id: "default-3",
      title: "Italian Tomato Pasta",
      cuisine: "Italian",
      mealType: "Lunch",
      prepTime: 25,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScnDhE1fWEaTvcfiTF5yvlt8ehcCSpRtFa_fDDmcsVEQ&s=10",
      description: "Pasta tossed in a homemade tomato, garlic, and herb sauce.",
      nutrition: { calories: 350, protein: 10 },
      ingredients: [
        { name: "Pasta", quantity: "200 g" },
        { name: "Tomatoes", quantity: "3 medium, chopped" },
        { name: "Garlic", quantity: "3 cloves, minced" },
        { name: "Onion", quantity: "1 small, chopped" },
        { name: "Olive oil", quantity: "1 tbsp" },
        { name: "Dried oregano", quantity: "1 tsp" },
        { name: "Black pepper", quantity: "To taste" },
        { name: "Salt", quantity: "To taste" },
        { name: "Fresh basil", quantity: "A few leaves" },
      ],
      instructions: [
        "Bring a pot of salted water to a boil.",
        "Add pasta and cook according to the package instructions.",
        "Heat olive oil in a pan and sauté the onion until soft.",
        "Add garlic and cook for 30 seconds.",
        "Add chopped tomatoes, oregano, salt, and pepper.",
        "Cook the sauce for 8–10 minutes until the tomatoes soften.",
        "Drain the pasta and add it to the sauce.",
        "Mix well, garnish with fresh basil, and serve.",
      ],
    },
    {
      _id: "default-4",
      title: "Mexican Bean Tacos",
      cuisine: "Mexican",
      mealType: "Dinner",
      prepTime: 20,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkb5zwcPZoxnX3uBvovcqYfal0W8Js48-M0pVYaj9bcg&s=10",
      description:
        "Quick bean tacos with fresh vegetables and a zesty lime dressing.",
      nutrition: { calories: 310, protein: 11 },
      ingredients: [
        { name: "Corn tortillas", quantity: "4 small" },
        { name: "Cooked black beans", quantity: "1 cup" },
        { name: "Tomato", quantity: "1 medium, diced" },
        { name: "Lettuce", quantity: "1 cup, shredded" },
        { name: "Red onion", quantity: "1/2 small, diced" },
        { name: "Avocado", quantity: "1/2, sliced" },
        { name: "Lime juice", quantity: "1 tbsp" },
        { name: "Cumin powder", quantity: "1/2 tsp" },
        { name: "Salt", quantity: "To taste" },
      ],
      instructions: [
        "Warm the cooked black beans in a pan.",
        "Add cumin powder and salt, then mix well.",
        "Warm the tortillas in a dry pan.",
        "Place the warm beans on each tortilla.",
        "Add lettuce, tomato, red onion, and avocado.",
        "Drizzle lime juice over the filling.",
        "Serve immediately while the tortillas are warm.",
      ],
    },
    {
      _id: "default-5",
      title: "Thai Coconut Vegetable Curry",
      cuisine: "Thai",
      mealType: "Dinner",
      prepTime: 30,
      difficulty: "Medium",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFl3_LTXS5e7FKywYxd3dTYl13WY6DsgmfrT-0YHAjlw&s=10",
      description:
        "A creamy coconut curry with vegetables and fragrant Thai-inspired flavours.",
      nutrition: { calories: 390, protein: 8 },
      ingredients: [
        { name: "Coconut milk", quantity: "1 cup" },
        { name: "Broccoli", quantity: "1 cup" },
        { name: "Bell pepper", quantity: "1 medium, sliced" },
        { name: "Carrot", quantity: "1 medium, sliced" },
        { name: "Mushrooms", quantity: "1 cup, sliced" },
        { name: "Thai curry paste", quantity: "1 tbsp, vegan-certified" },
        { name: "Soy sauce", quantity: "1 tbsp" },
        { name: "Cooking oil", quantity: "1 tsp" },
        { name: "Lime juice", quantity: "1 tsp" },
      ],
      instructions: [
        "Wash and chop all the vegetables.",
        "Heat oil in a deep pan over medium heat.",
        "Add vegan Thai curry paste and stir for about one minute.",
        "Pour in the coconut milk and stir until combined.",
        "Add the carrot, broccoli, bell pepper, and mushrooms.",
        "Simmer for 12–15 minutes until the vegetables are tender.",
        "Stir in soy sauce and lime juice.",
        "Taste, adjust the seasoning, and serve with rice.",
      ],
    },
    {
      _id: "default-6",
      title: "Japanese Vegetable Sushi Bowl",
      cuisine: "Japanese",
      mealType: "Lunch",
      prepTime: 25,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNPFBH6UIZR95UIfSd28VssssD1IsGQ3aXCjxoANj7JQ&s=10",
      description:
        "A sushi-inspired rice bowl topped with fresh vegetables and tofu.",
      nutrition: { calories: 330, protein: 12 },
      ingredients: [
        { name: "Sushi rice", quantity: "1 cup uncooked" },
        { name: "Cucumber", quantity: "1/2, sliced" },
        { name: "Carrot", quantity: "1 small, julienned" },
        { name: "Avocado", quantity: "1/2, sliced" },
        { name: "Firm tofu", quantity: "100 g, cubed" },
        { name: "Rice vinegar", quantity: "1 tbsp" },
        { name: "Soy sauce", quantity: "1 tbsp" },
        { name: "Sesame seeds", quantity: "1 tsp" },
        { name: "Nori sheet", quantity: "1, cut into strips" },
      ],
      instructions: [
        "Rinse the sushi rice until the water runs mostly clear.",
        "Cook the rice according to the package instructions.",
        "Mix the cooked rice with rice vinegar and let it cool slightly.",
        "Pan-fry the tofu cubes until lightly golden.",
        "Slice the cucumber, carrot, and avocado.",
        "Divide the rice between serving bowls.",
        "Arrange the vegetables and tofu over the rice.",
        "Drizzle with soy sauce and garnish with sesame seeds and nori strips.",
      ],
    },
    {
      _id: "default-7",
      title: "Healthy Banana Oatmeal",
      cuisine: "Global",
      mealType: "Breakfast",
      prepTime: 10,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFwfZ4vZ8N-eEB57lEtESpy1olTzd2SarCgB_JRE74QA&s=10",
      description:
        "Warm oatmeal with banana and cinnamon for a simple breakfast.",
      nutrition: { calories: 280, protein: 8 },
      ingredients: [
        { name: "Rolled oats", quantity: "1/2 cup" },
        { name: "Plant-based milk", quantity: "1 cup" },
        { name: "Banana", quantity: "1 medium, sliced" },
        { name: "Chia seeds", quantity: "1 tsp" },
        { name: "Cinnamon", quantity: "1/4 tsp" },
        { name: "Maple syrup", quantity: "1 tsp, optional" },
      ],
      instructions: [
        "Add oats and plant-based milk to a small saucepan.",
        "Bring to a gentle simmer over medium heat.",
        "Cook for 4–5 minutes, stirring regularly.",
        "Mash half the banana and stir it into the oatmeal.",
        "Add cinnamon and chia seeds.",
        "Pour into a bowl and top with the remaining banana.",
        "Add maple syrup if desired and serve warm.",
      ],
    },
    {
      _id: "default-8",
      title: "Crispy Roasted Chickpeas",
      cuisine: "Indian",
      mealType: "Snack",
      prepTime: 25,
      difficulty: "Easy",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrp2QaRmR0Gd7Jw253_LS1dvo3_2mdOrc1p5-da5CH9g&s=10",
      description:
        "Crunchy oven-roasted chickpeas seasoned with aromatic spices.",
      nutrition: { calories: 180, protein: 9 },
      ingredients: [
        { name: "Cooked chickpeas", quantity: "1 cup, drained" },
        { name: "Olive oil", quantity: "1 tsp" },
        { name: "Paprika", quantity: "1/2 tsp" },
        { name: "Cumin powder", quantity: "1/2 tsp" },
        { name: "Garlic powder", quantity: "1/4 tsp" },
        { name: "Salt", quantity: "To taste" },
      ],
      instructions: [
        "Preheat the oven to 200°C.",
        "Drain the chickpeas and pat them dry thoroughly.",
        "Toss the chickpeas with olive oil, paprika, cumin, garlic powder, and salt.",
        "Spread them in a single layer on a baking tray.",
        "Roast for 20–25 minutes, shaking the tray halfway through.",
        "Check that the chickpeas are crisp, then let them cool slightly.",
        "Serve as a crunchy snack.",
      ],
    },
  ];

  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


useEffect(() => {
  const fetchDailyRecipe = async () => {
    try {
      setDailyLoading(true);

      const response = await fetch(
        `${API_URL}/api/recipes/daily/today`
      );

      const data = await response.json();

      console.log("Daily recipe API URL:", `${API_URL}/api/recipes/daily/today`);
      console.log("Daily recipe API response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to load daily recipe"
        );
      }

      const recipe = data.recipe || data.recipes?.[0] || null;

      if (!recipe) {
        throw new Error("API returned no daily recipe.");
      }

      setDailyRecipe(recipe);
    } catch (error) {
      console.error("Daily recipe error:", error);
      setDailyRecipe(null);
    } finally {
      setDailyLoading(false);
    }
  };

  fetchDailyRecipe();
}, []);



  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        setNutritionLoading(true);

        const response = await fetch(`${API_URL}/api/nutrition`);

        if (!response.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const data = await response.json();

        setNutritionData(data.nutrition || []);
      } catch (error) {
        console.error("Nutrition fetch error:", error);
      } finally {
        setNutritionLoading(false);
      }
    };

    fetchNutrition();
  }, []);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    setError("");
    setAiRecipe(null);

    try {
      const response = await fetch(`${API_URL}/api/recipes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          cuisine,
          mealType,
          goal,
          calories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to generate recipe",
        );
      }

      setAiRecipe(data.recipe);
    } catch (err) {
      console.error("Recipe generation error:", err);
      setError(
        "Unable to generate recipe. Make sure your backend and Ollama are running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setRecipesLoading(true);

      try {
        const searchText = recipeSearch.trim().toLowerCase();

        // 1. Fetch recipes from your existing backend
        const response = await fetch(`${API_URL}/api/recipes`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch local recipes");
        }

        const backendRecipes = data.recipes || [];

        // 2. Combine default cards with backend recipes
        const combinedRecipes = [
          ...defaultRecipes,
          ...backendRecipes.filter(
            (recipe) =>
              !defaultRecipes.some(
                (defaultRecipe) =>
                  defaultRecipe.title.toLowerCase() ===
                  recipe.title?.toLowerCase(),
              ),
          ),
        ];

        // 3. Filter local recipes by search and category
        const localResults = combinedRecipes.filter((recipe) => {
          const matchesSearch =
            !searchText ||
            recipe.title?.toLowerCase().includes(searchText) ||
            recipe.cuisine?.toLowerCase().includes(searchText) ||
            recipe.mealType?.toLowerCase().includes(searchText) ||
            recipe.description?.toLowerCase().includes(searchText) ||
            recipe.ingredients?.some((ingredient) =>
              ingredient.name?.toLowerCase().includes(searchText),
            );

          const matchesCategory =
            !selectedCategory ||
            selectedCategory === "All" ||
            (["Breakfast", "Lunch", "Dinner", "Snack"].includes(
              selectedCategory,
            )
              ? recipe.mealType === selectedCategory
              : recipe.cuisine?.toLowerCase() ===
                selectedCategory.toLowerCase());

          return matchesSearch && matchesCategory;
        });

        // 4. If the search box is empty, show local recipes
        if (!searchText) {
          setRecipes(localResults);
          return;
        }

       
       
        // 5. Search online recipes by name and ingredients
        const searchTerm = recipeSearch.trim();

        const searchTerms = [
          searchTerm,
          ...searchTerm
            .split(/\s+/)
            .filter((word) => word.length >= 3),
        ];

        const uniqueTerms = [
          ...new Set(searchTerms.map((term) => term.toLowerCase())),
        ];

        const onlineRecipeMap = new Map();

        await Promise.all(
          uniqueTerms.map(async (term) => {
            try {
              // Search by recipe name
              const nameResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`,
              );

              if (nameResponse.ok) {
                const nameData = await nameResponse.json();

                (nameData.meals || []).forEach((meal) => {
                  onlineRecipeMap.set(meal.idMeal, meal);
                });
              }

              // Search by ingredient
              const ingredientResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(term.replace(/\s+/g, "_"))}`,
              );

              if (ingredientResponse.ok) {
                const ingredientData = await ingredientResponse.json();

                (ingredientData.meals || []).forEach((meal) => {
                  onlineRecipeMap.set(meal.idMeal, meal);
                });
              }
            } catch (error) {
              console.error(`Search failed for ${term}:`, error);
            }
          }),
        );

        // 6. Get full details for every unique recipe
        const onlineResults = await Promise.all(
          [...onlineRecipeMap.values()].map(async (meal) => {
            try {
              const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`,
              );

              if (!response.ok) return null;

              const data = await response.json();
              const fullMeal = data.meals?.[0];

              if (!fullMeal) return null;

              const ingredients = [];

              for (let i = 1; i <= 20; i++) {
                const name = fullMeal[`strIngredient${i}`]?.trim();
                const quantity = fullMeal[`strMeasure${i}`]?.trim();

                if (name) {
                  ingredients.push({
                    name,
                    quantity: quantity || "",
                  });
                }
              }

              return {
                externalId: fullMeal.idMeal,
                title: fullMeal.strMeal,
                cuisine: fullMeal.strArea || "Global",
                mealType: fullMeal.strCategory || "Vegan",
                description: fullMeal.strInstructions || "",
                image: fullMeal.strMealThumb,
                prepTime: 0,
                ingredients,
                instructions: fullMeal.strInstructions
                  ? fullMeal.strInstructions
                      .split(/\r?\n/)
                      .map((step) => step.trim())
                      .filter(Boolean)
                  : [],
                sourceUrl: fullMeal.strSource || "",
                youtubeUrl: fullMeal.strYoutube || "",
                nutrition: { calories: 0 },
              };
            } catch (error) {
              console.error("Could not load recipe details:", error);
              return null;
            }
          }),
        );

        const onlineRecipes = onlineResults.filter(Boolean);

        // 7. Remove recipes with obvious non-vegan ingredients
        const nonVeganPattern =
          /\b(chicken|beef|pork|lamb|bacon|ham|fish|salmon|tuna|shrimp|prawn|seafood|anchovy|egg|eggs|cheese|butter|ghee|honey|gelatin|whey|yogurt|yoghurt|mayonnaise|cream)\b/i;

        const veganCandidates = onlineRecipes.filter((recipe) =>
          recipe.ingredients.every((ingredient) => {
            const name = ingredient.name
              .toLowerCase()
              .replace(
                /\b(coconut|almond|soy|oat|rice|cashew|plant-based)\s+milk\b/gi,
                "",
              );

            return !nonVeganPattern.test(name);
          }),
        );

        // 8. Combine local and online recipes without duplicate titles
        const seenTitles = new Set(
          localResults.map((recipe) => recipe.title?.toLowerCase()),
        );

        const uniqueOnlineRecipes = veganCandidates.filter((recipe) => {
          const title = recipe.title?.toLowerCase();

          if (!title || seenTitles.has(title)) return false;

          seenTitles.add(title);
          return true;
        });

        const results = [...localResults, ...uniqueOnlineRecipes];

        setRecipes(results);


      } catch (error) {
        console.error("RECIPE SEARCH ERROR:", error);

        // Keep local recipes available if online search fails
        const searchText = recipeSearch.trim().toLowerCase();

        const fallbackRecipes = defaultRecipes.filter((recipe) => {
          const matchesSearch =
            !searchText ||
            recipe.title.toLowerCase().includes(searchText) ||
            recipe.cuisine.toLowerCase().includes(searchText) ||
            recipe.mealType.toLowerCase().includes(searchText);

          const matchesCategory =
            !selectedCategory ||
            (["Breakfast", "Lunch", "Dinner", "Snack"].includes(
              selectedCategory,
            )
              ? recipe.mealType === selectedCategory
              : recipe.cuisine.toLowerCase() ===
                selectedCategory.toLowerCase());

          return matchesSearch && matchesCategory;
        });

        setRecipes(fallbackRecipes);
      } finally {
        setRecipesLoading(false);
      }
    };

    const timer = setTimeout(fetchRecipes, 400);

    return () => clearTimeout(timer);
  }, [recipeSearch, selectedCategory]);

  return (
    <div className="page-container">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <span>VEGAN RECIPES</span>

        <h1>Eat Well. Feel Good. 🌱</h1>

        <p>
          Discover nutritious vegan recipes from Indian, Asian and global
          cuisines.
        </p>
      </div>

      {/* RECIPE OF THE DAY */}
      <div className="daily-recipe-section">
        <div className="daily-recipe-heading">
          <span>🌱 VEGAN PATH DAILY</span>

          <h2>Today's AI Recipe</h2>

          <p>A fresh vegan recipe created especially for today.</p>
        </div>

        {dailyLoading && (
          <div className="daily-loading">🤖 Creating today's recipe...</div>
        )}

        {!dailyLoading && dailyRecipe && (
          <div className="daily-recipe-card">
            <div className="daily-recipe-content">
              <span className="daily-badge">✨ RECIPE OF THE DAY</span>

              <h2>{dailyRecipe.title}</h2>

              <p>{dailyRecipe.description}</p>

              <div className="daily-recipe-stats">
                <div>
                  🍽️
                  <strong>{dailyRecipe.cuisine}</strong>
                </div>

                <div>
                  ⏱️
                  <strong>{dailyRecipe.prepTime} min</strong>
                </div>

                <div>
                  🔥
                  <strong>{dailyRecipe.nutrition?.calories ?? "—"} kcal</strong>
                </div>

                <div>
                  💪
                  <strong>
                    {dailyRecipe.nutrition?.protein ?? "—"}g protein
                  </strong>
                </div>
              </div>

              <h3>🥗 Ingredients</h3>

              <ul>
                {dailyRecipe.ingredients?.map((ingredient, index) => (
                  <li key={ingredient._id || index}>
                    <strong>{ingredient.quantity}</strong> {ingredient.name}
                  </li>
                ))}
              </ul>

              <h3>👨‍🍳 Instructions</h3>

              <ol>
                {dailyRecipe.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {!dailyLoading && !dailyRecipe && (
          <div className="daily-loading">
            Today's recipe could not be loaded.
          </div>
        )}
      </div>

      {/* ============================= */}
      {/* CUISINE NUTRITION */}
      {/* ============================= */}

      <div className="cuisine-nutrition-section">
        <div className="cuisine-nutrition-heading">
          <span>🥗 NUTRITION GUIDE</span>

          <h2>Nutrition by Cuisine</h2>

          <p>Explore the nutritional profile of popular vegan cuisines.</p>
        </div>

        <div className="cuisine-grid">
          {nutritionLoading && (
            <div className="nutrition-loading">
              🥗 Loading nutrition information...
            </div>
          )}

          {!nutritionLoading && nutritionData.length === 0 && (
            <div className="nutrition-loading">
              Nutrition information is currently unavailable.
            </div>
          )}

          {!nutritionLoading &&
            nutritionData.map((item) => (
              <div className="cuisine-card" key={item._id}>
                <div className="cuisine-icon">
                  {item.cuisine === "Indian" && "🇮🇳"}
                  {item.cuisine === "Asian" && "🍜"}
                  {item.cuisine === "Italian" && "🍝"}
                  {item.cuisine === "Mexican" && "🌮"}
                  {item.cuisine === "Thai" && "🍲"}
                  {item.cuisine === "Japanese" && "🍱"}
                </div>

                <h3>{item.cuisine}</h3>

                <p>{item.description}</p>

                <div className="cuisine-nutrition">
                  <div>
                    <strong>{item.calories}</strong>

                    <span>Calories</span>
                  </div>

                  <div>
                    <strong>{item.protein}g</strong>

                    <span>Protein</span>
                  </div>

                  <div>
                    <strong>{item.carbohydrates}g</strong>

                    <span>Carbs</span>
                  </div>

                  <div>
                    <strong>{item.fiber}g</strong>

                    <span>Fiber</span>
                  </div>
                </div>

                {/* EXTRA NUTRITION */}

                <div className="extra-nutrition">
                  <span>Fat: {item.fat}g</span>

                  <span>Iron: {item.iron}mg</span>

                  <span>Calcium: {item.calcium}mg</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* AI RECIPE GENERATOR */}
      <div className="ai-recipe-generator">
        <div className="ai-heading">
          <span>🤖 AI RECIPE GENERATOR</span>

          <h2>Create Your Own Vegan Recipe 🌱</h2>

          <p>
            Tell our AI what ingredients you have and get a personalized vegan
            recipe with nutrition information.
          </p>
        </div>

        {/* INGREDIENTS */}
        <div className="form-group">
          <label>Ingredients</label>

          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Example: tofu, spinach, tomato"
          />
        </div>

        {/* OPTIONS */}
        <div className="recipe-options">
          <div className="form-group">
            <label>Cuisine</label>

            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option>Indian</option>
              <option>Italian</option>
              <option>Asian</option>
              <option>Mexican</option>
              <option>Thai</option>
              <option>Japanese</option>
              <option>Global</option>
            </select>
          </div>

          <div className="form-group">
            <label>Meal Type</label>

            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          <div className="form-group">
            <label>Health Goal</label>

            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>High Protein</option>
              <option>Weight Management</option>
              <option>Healthy</option>
              <option>Energy</option>
              <option>Balanced Nutrition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Target Calories</label>

            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min="100"
              max="2000"
            />
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <button
          className="generate-recipe-btn"
          onClick={generateRecipe}
          disabled={loading}
        >
          {loading ? "🤖 Creating Your Recipe..." : "✨ Generate Vegan Recipe"}
        </button>

        {/* ERROR */}
        {error && <p className="recipe-error">⚠️ {error}</p>}
      </div>

      {/* AI RESULT */}
      {aiRecipe && (
        <div className="ai-recipe-result">
          <div className="ai-result-header">
            <span>✨ AI GENERATED RECIPE</span>

            <h2>{aiRecipe.title}</h2>

            <p>{aiRecipe.description}</p>
          </div>

          {/* BASIC INFORMATION */}
          <div className="recipe-info">
            <div>
              🍽️
              <strong>{aiRecipe.cuisine}</strong>
              <span>Cuisine</span>
            </div>

            <div>
              ⏱️
              <strong>{aiRecipe.prepTime} min</strong>
              <span>Prep Time</span>
            </div>

            <div>
              🔥
              <strong>{aiRecipe.nutrition.calories} kcal</strong>
              <span>Calories</span>
            </div>

            <div>
              💪
              <strong>{aiRecipe.nutrition.protein} g</strong>
              <span>Protein</span>
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="recipe-section">
            <h3>🥗 Ingredients</h3>

            <ul>
              {aiRecipe.ingredients.map((item, index) => (
                <li key={item._id || index}>
                  <strong>{item.quantity}</strong> {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* INSTRUCTIONS */}
          <div className="recipe-section">
            <h3>👨‍🍳 Instructions</h3>

            <ol>
              {aiRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* yt link for recipe  */}
          <div className="video-section">
            <p>🎥 Want to see how it's prepared?</p>

            <a
              href={getYouTubeSearchUrl(aiRecipe)}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-video-btn"
            >
              ▶ Watch Recipe Videos on YouTube
            </a>
          </div>

          {/* NUTRITION */}
          <div className="nutrition-section">
            <h3>📊 Nutritional Value Per Serving</h3>

            <div className="nutrition-grid">
              <div>
                <strong>{aiRecipe.nutrition.calories}</strong>
                <span>Calories</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.protein}g</strong>
                <span>Protein</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.carbohydrates}g</strong>
                <span>Carbs</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.fat}g</strong>
                <span>Fat</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.fiber}g</strong>
                <span>Fiber</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.iron}mg</strong>
                <span>Iron</span>
              </div>

              <div>
                <strong>{aiRecipe.nutrition.calcium}mg</strong>
                <span>Calcium</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXISTING RECIPES */}
      {/* RECIPE LIBRARY */}

      <div className="recipe-library-section">
        <div className="recipe-library-heading">
          <span>🍽️ RECIPE LIBRARY</span>

          <h2>Explore Vegan Recipes</h2>

          <p>
            Discover recipes from your personalized vegan recipe collection.
          </p>
        </div>

        {/* SEARCH */}

        <div className="search-box">
          <input
            type="text"
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            placeholder="Search recipes..."
          />

          <button onClick={() => setRecipeSearch(recipeSearch.trim())}>
            🔍 Search
          </button>
        </div>

        {/* CATEGORIES */}

        <div className="category-buttons">
          {[
            "All",
            "Breakfast",
            "Lunch",
            "Dinner",
            "Snack",
            "Indian",
            "Asian",
            "Italian",
            "Mexican",
            "Thai",
            "Japanese",
          ].map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category ||
                (category === "All" && selectedCategory === "")
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category === "All" ? "" : category)
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* RECIPES */}

        <div className="recipe-grid">
          {recipesLoading && recipes.length === 0 && (
            <div className="nutrition-loading">🌱 Loading recipes...</div>
          )}

          {!recipesLoading && recipes.length === 0 && (
            <div className="nutrition-loading">🍽️ No recipes found.</div>
          )}

          {!recipesLoading &&
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id || recipe.externalId || recipe.title}
                recipe={recipe}
                onView={() => {
                  if (recipe.externalId) {
                    // Online recipe: open details with complete data
                    navigate(`/recipe/${recipe.externalId}`, {
                      state: { recipe },
                    });
                  } else if (recipe._id && /^[a-f\d]{24}$/i.test(recipe._id)) {
                    // Database recipe
                    navigate(`/recipe/${recipe._id}`);
                  } else {
                    // Default recipe: show its details directly
                    navigate(`/recipe/${encodeURIComponent(recipe.title)}`, {
                      state: { recipe },
                    });
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
