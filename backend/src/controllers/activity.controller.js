const Activity = require('../models/activity.model');
const activityData = require('../utils/activityData');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all activities (with optional filter)
// @route   GET /api/activities
// @access  Private
const getActivities = asyncHandler(async (req, res, next) => {
      const { category, search, cost, duration } = req.query;

    let query = {};

    /* =========================
       CATEGORY FILTER
    ========================= */
    if (category && category !== "All") {
      query.category = category;
    }

    /* =========================
       SEARCH FILTER
    ========================= */
    if (search) {
      query.$or = [
        {
          activityName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* =========================
       COST FILTER
    ========================= */
    if (cost === "free") {
      query.cost = 0;
    }

    if (cost === "paid") {
      query.cost = { $gt: 0 };
    }

    /* =========================
       FETCH ACTIVITIES
    ========================= */
    let activities = await Activity.find(query).sort({ rating: -1 });

    /* =========================
       DURATION FILTER
       (Handled after fetch because
       duration is stored as string)
    ========================= */
    if (duration === "short") {
      activities = activities.filter(
        (a) => a.duration?.includes("1") || a.duration?.includes("2"),
      );
    }

    if (duration === "long") {
      activities = activities.filter(
        (a) =>
          a.duration?.includes("3") ||
          a.duration?.includes("4") ||
          a.duration?.includes("Full"),
      );
    }

    /* =========================
       AUTO SEED DATABASE
    ========================= */
    if (activities.length === 0 && !category && !search && !cost && !duration) {
      activities = await Activity.insertMany(activityData);
    }

  res.status(200).json(new ApiResponse(200, { count: activities.length, activities }, "Activities fetched successfully"));
});

// @desc    Add new activity (admin)
// @route   POST /api/activities/add
// @access  Private/Admin
const addActivity = asyncHandler(async (req, res, next) => {
      const {
      activityName,
      category,
      cost,
      duration,
      description,
      image,
      rating,
    } = req.body;

    if (!activityName || !category) {
      return res.status(400).json({
        success: false,
        message: "Activity name and category are required",
      });
    }

    const activity = await Activity.create({
      activityName,
      category,
      cost,
      duration,
      description,
      image,
      rating,
    });

  res.status(201).json(new ApiResponse(201, { activity }, "Activity added successfully"));
});

// @desc    Seed activities from data file
// @route   POST /api/activities/seed
// @access  Private/Admin
const seedActivities = asyncHandler(async (req, res, next) => {
   await Activity.deleteMany({});

    const activities = await Activity.insertMany(activityData);

  res.status(200).json(new ApiResponse(200, { count: activities.length }, `${activities.length} activities seeded successfully`));
});

module.exports = { getActivities, addActivity, seedActivities };
