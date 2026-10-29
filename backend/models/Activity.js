const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    veganMeals: {
      type: Number,
      default: 0,
    },

    water: {
      type: Number,
      default: 0,
    },

    waterGoal: {
      type: Number,
      default: 12,
    },

    exercise: {
      type: Boolean,
      default: false,
    },

    learning: {
      type: Boolean,
      default: false,
    },

    completedGoals: {
      type: Number,
      default: 0,
    },

    totalGoals: {
      type: Number,
      default: 4,
    },

    streak: {
      type: Number,
      default: 0,
    },
    streakAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Activity", activitySchema);
