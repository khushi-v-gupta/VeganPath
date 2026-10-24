
require("dotenv").config();

const mongoose = require("mongoose");
const Meal = require("./models/Meal");

const meals = [
  {
    name: "Rajma Rice",
    cuisine: "Indian",
    description: "Kidney beans served with rice.",
    servingSize: "1 serving (approx. 350 g)",
    calories: 380,
    protein: 13,
    carbohydrates: 65,
    fat: 7,
    fiber: 11,
    iron: 4,
    calcium: 80,
    ingredients: [
      { name: "Cooked rajma", quantity: "150 g" },
      { name: "Cooked rice", quantity: "180 g" },
      { name: "Tomato and onion gravy", quantity: "20 g" }
    ]
  },
  {
    name: "Moong Dal Chilla",
    cuisine: "Indian",
    description: "Savory pancakes made from moong dal.",
    servingSize: "2 medium chillas",
    calories: 260,
    protein: 14,
    carbohydrates: 36,
    fat: 6,
    fiber: 7,
    iron: 3,
    calcium: 45,
    ingredients: [
      { name: "Moong dal", quantity: "70 g dry" },
      { name: "Onion and spices", quantity: "As needed" },
      { name: "Cooking oil", quantity: "1 teaspoon" }
    ]
  },
  {
    name: "Dal Roti",
    cuisine: "Indian",
    description: "Lentil dal served with whole-wheat rotis.",
    servingSize: "1 bowl dal + 2 medium rotis",
    calories: 360,
    protein: 15,
    carbohydrates: 58,
    fat: 7,
    fiber: 12,
    iron: 4,
    calcium: 65,
    ingredients: [
      { name: "Cooked lentils", quantity: "180 g" },
      { name: "Whole-wheat rotis", quantity: "2 medium" },
      { name: "Cooking oil", quantity: "1 teaspoon" }
    ]
  },
  {
    name: "Tofu Rice Bowl",
    cuisine: "Asian",
    description: "Tofu with rice and mixed vegetables.",
    servingSize: "1 bowl (approx. 350 g)",
    calories: 400,
    protein: 22,
    carbohydrates: 48,
    fat: 12,
    fiber: 6,
    iron: 4,
    calcium: 250,
    ingredients: [
      { name: "Firm tofu", quantity: "150 g" },
      { name: "Cooked rice", quantity: "150 g" },
      { name: "Mixed vegetables", quantity: "100 g" }
    ]
  },
  {
    name: "Chickpea Salad",
    cuisine: "Mediterranean",
    description: "Chickpeas mixed with fresh vegetables and lemon dressing.",
    servingSize: "1 bowl (approx. 300 g)",
    calories: 320,
    protein: 14,
    carbohydrates: 45,
    fat: 9,
    fiber: 12,
    iron: 4,
    calcium: 90,
    ingredients: [
      { name: "Cooked chickpeas", quantity: "180 g" },
      { name: "Cucumber and tomato", quantity: "100 g" },
      { name: "Olive oil and lemon", quantity: "1 teaspoon oil + lemon juice" }
    ]
  }
];

async function seedMeals() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Meal.deleteMany({});
    await Meal.insertMany(meals);

    console.log("Meal data inserted successfully");
  } catch (error) {
    console.error("Failed to insert meal data:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedMeals();