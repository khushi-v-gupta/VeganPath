
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Use a consistent date format for activity records.
const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

// =========================
// GET TODAY'S ACTIVITY
// =========================

router.get("/today", protect, async (req, res) => {
  try {
    const today = getToday();

    let activity = await Activity.findOne({
      userId: req.userId,
      date: today,
    });

    if (!activity) {
      activity = await Activity.create({
        userId: req.userId,
        date: today,
      });
    }

    res.json(activity);
  } catch (error) {
    console.error("GET ACTIVITY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =========================
// UPDATE TODAY'S ACTIVITY
// =========================

// =========================
// UPDATE TODAY'S ACTIVITY
// =========================

router.put("/today", protect, async (req, res) => {
  try {
    const today = getToday();

    const allowedFields = [
      "veganMeals",
      "water",
      "waterGoal",
      "exercise",
      "learning",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Get today's existing activity.
    let activity = await Activity.findOne({
      userId: req.userId,
      date: today,
    });

    // Create today's record if it doesn't exist.
    if (!activity) {
      activity = new Activity({
        userId: req.userId,
        date: today,
      });
    }

    // Apply the requested changes.
    Object.assign(activity, updates);

    // Calculate the four goals from actual activity values.
    const goals = [
      Number(activity.veganMeals || 0) > 0,
      Number(activity.water || 0) >= Number(activity.waterGoal || 12),
      activity.exercise === true,
      activity.learning === true,
    ];

    activity.totalGoals = 4;
    activity.completedGoals = goals.filter(Boolean).length;

    // Only award a streak when all four goals are complete.
    if (activity.completedGoals === activity.totalGoals) {
      // Find the previous day's record.
      const previousDate = new Date(
        `${today}T12:00:00+05:30`
      );

      previousDate.setDate(previousDate.getDate() - 1);

      const yesterday = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(previousDate);

      const previousActivity = await Activity.findOne({
        userId: req.userId,
        date: yesterday,
      });

      // If today's streak was already awarded, don't increment it again.
      // Otherwise continue yesterday's streak or start a new one.
      if (!activity.streakAwarded) {
        activity.streak = previousActivity &&
          previousActivity.completedGoals === previousActivity.totalGoals
            ? Number(previousActivity.streak || 0) + 1
            : 1;

        activity.streakAwarded = true;
      }
    } else {
      // Preserve the streak already awarded for today.
      // It will not increase until all goals are completed.
    }

    await activity.save();

    res.json({
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    console.error("UPDATE ACTIVITY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// GET PROGRESS STATISTICS
// =========================

router.get("/progress", protect, async (req, res) => {
  try {
    const today = getToday();

    // Fetch this user's records from the last 30 days.
    const startDate = new Date(`${today}T00:00:00+05:30`);
    startDate.setDate(startDate.getDate() - 29);

    const startDateString = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startDate);

    const records = await Activity.find({
      userId: req.userId,
      date: {
        $gte: startDateString,
        $lte: today,
      },
    }).sort({ date: 1 });

    // A recorded day counts as a vegan day when at least one
    // vegan meal was recorded. Adjust this rule if your app
    // uses a different definition of a vegan day.
    const totalVeganDays = records.filter(
      (record) => Number(record.veganMeals || 0) > 0
    ).length;

    // Total meals recorded in the fetched period.
    const veganMeals = records.reduce(
      (total, record) => total + Number(record.veganMeals || 0),
      0
    );

    // Use today's saved streak as the current streak.
    const todayRecord = records.find(
      (record) => record.date === today
    );

    const streak = Number(todayRecord?.streak || 0);

    // Build a Monday-to-Sunday chart for the current week.
    const now = new Date(`${today}T12:00:00+05:30`);
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const weekDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    });

    const weeklyActivity = weekDates.map((date) => {
      const record = records.find((item) => item.date === date);

      return {
        date,
        day: new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
        }).format(new Date(`${date}T12:00:00+05:30`)),
        veganMeals: Number(record?.veganMeals || 0),
        completedGoals: Number(record?.completedGoals || 0),
        totalGoals: Number(record?.totalGoals || 0),
        // Percentage of goals completed for this day.
        percentage: record?.totalGoals
          ? Math.min(
              100,
              Math.round(
                (Number(record.completedGoals || 0) /
                  Number(record.totalGoals)) *
                  100
              )
            )
          : 0,
      };
    });

    res.json({
      totalVeganDays,
      veganMeals,
      streak,
      weeklyActivity,
    });
  } catch (error) {
    console.error("GET PROGRESS ERROR:", error);

    res.status(500).json({
      message: "Unable to load progress",
    });
  }
});

module.exports = router;

