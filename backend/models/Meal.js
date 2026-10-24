const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    cuisine: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    servingSize: {
      type: String,
      required: true
    },

    calories: {
      type: Number,
      required: true
    },

    protein: {
      type: Number,
      required: true
    },

    carbohydrates: {
      type: Number,
      required: true
    },

    fat: {
      type: Number,
      required: true
    },

    fiber: {
      type: Number,
      required: true
    },

    iron: {
      type: Number,
      required: true
    },

    calcium: {
      type: Number,
      required: true
    },

    ingredients: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meal", mealSchema);
