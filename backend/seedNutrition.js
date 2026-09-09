const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Nutrition = require("./models/Nutrition");

dotenv.config();

const nutritionData = [
  {
    cuisine: "Indian",
    description:
      "Lentils, vegetables, legumes and plant-based proteins.",
    calories: 420,
    protein: 18,
    carbohydrates: 55,
    fat: 14,
    fiber: 14,
    iron: 6,
    calcium: 180
  },

  {
    cuisine: "Asian",
    description:
      "Tofu, vegetables, rice, mushrooms and plant-based proteins.",
    calories: 390,
    protein: 20,
    carbohydrates: 48,
    fat: 13,
    fiber: 9,
    iron: 5,
    calcium: 160
  },

  {
    cuisine: "Italian",
    description:
      "Whole grains, tomatoes, vegetables, beans and herbs.",
    calories: 450,
    protein: 16,
    carbohydrates: 62,
    fat: 15,
    fiber: 11,
    iron: 4,
    calcium: 140
  },

  {
    cuisine: "Mexican",
    description:
      "Beans, corn, avocado, vegetables and whole grains.",
    calories: 430,
    protein: 19,
    carbohydrates: 52,
    fat: 16,
    fiber: 13,
    iron: 5,
    calcium: 170
  },

  {
    cuisine: "Thai",
    description:
      "Tofu, vegetables, herbs, rice and coconut-based dishes.",
    calories: 410,
    protein: 17,
    carbohydrates: 50,
    fat: 17,
    fiber: 8,
    iron: 4,
    calcium: 150
  },

  {
    cuisine: "Japanese",
    description:
      "Tofu, edamame, vegetables, rice and sea vegetables.",
    calories: 380,
    protein: 21,
    carbohydrates: 46,
    fat: 11,
    fiber: 8,
    iron: 5,
    calcium: 190
  }
];

async function seedNutrition() {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Nutrition.deleteMany({});

    await Nutrition.insertMany(nutritionData);

    console.log("Nutrition data inserted successfully");

    await mongoose.disconnect();

  } catch (error) {

    console.error("SEED ERROR:", error);

  }
}

seedNutrition();