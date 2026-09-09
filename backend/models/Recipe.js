const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
    },

    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
      },
    ],

    instructions: [
      {
        type: String,
        required: true,
      },
    ],

    nutrition: {
      calories: {
        type: Number,
        default: 0,
      },

      protein: {
        type: Number,
        default: 0,
      },

      carbohydrates: {
        type: Number,
        default: 0,
      },

      fat: {
        type: Number,
        default: 0,
      },

      fiber: {
        type: Number,
        default: 0,
      },

      iron: {
        type: Number,
        default: 0,
      },

      calcium: {
        type: Number,
        default: 0,
      },
    },

    prepTime: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    image: {
      type: String,
      default: "",
    },

    isDailyRecipe: {
      type: Boolean,
      default: false,
    },

    dailyDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;