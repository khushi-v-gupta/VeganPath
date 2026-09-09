const express = require("express");
const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");

const router = express.Router();


// =========================
// AUTH MIDDLEWARE
// =========================

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);
    
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// =========================
// GET TODAY'S ACTIVITY
// =========================

router.get("/today", protect, async (req, res) => {

  try {

    const today = new Date()
      .toISOString()
      .split("T")[0];

    let activity = await Activity.findOne({
      userId: req.userId,
      date: today,
    });

    // Create today's record if it doesn't exist
    if (!activity) {

      activity = await Activity.create({
        userId: req.userId,
        date: today,
      });

    }

    res.json(activity);

  } catch (error) {

    console.error(
      "GET ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });

  }

});


// =========================
// UPDATE TODAY'S ACTIVITY
// =========================

router.put("/today", protect, async (req, res) => {

  try {

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const allowedFields = [
      "veganMeals",
      "water",
      "waterGoal",
      "exercise",
      "learning",
      "completedGoals",
      "totalGoals",
      "streak",
    ];

    const updates = {};

    allowedFields.forEach((field) => {

      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }

    });

    const activity =
      await Activity.findOneAndUpdate(
        {
          userId: req.userId,
          date: today,
        },
        {
          $set: updates,
          $setOnInsert: {
            userId: req.userId,
            date: today,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      message: "Activity updated successfully",
      activity,
    });

  } catch (error) {

    console.error(
      "UPDATE ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });

  }

});


module.exports = router;