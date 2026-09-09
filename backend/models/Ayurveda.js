const mongoose = require("mongoose");

const ayurvedaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    emoji: {
      type: String,
      default: "🌿",
    },

    description: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      default: "Ayurvedic Food",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ayurveda", ayurvedaSchema);