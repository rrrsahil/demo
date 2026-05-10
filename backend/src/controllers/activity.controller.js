const Activity = require('../models/activity.model');
const activityData = require('../utils/activityData');

// @desc    Get all activities (with optional filter)
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.activityName = { $regex: search, $options: 'i' };

    let activities = await Activity.find(query).sort({ rating: -1 });

    // Auto-seed if empty
    if (activities.length === 0 && !category && !search) {
      activities = await Activity.insertMany(activityData);
    }

    res.json({ success: true, count: activities.length, activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new activity (admin)
// @route   POST /api/activities/add
// @access  Private/Admin
const addActivity = async (req, res, next) => {
  try {
    const { activityName, category, cost, duration, description } = req.body;
    if (!activityName || !category) {
      return res.status(400).json({ success: false, message: 'Activity name and category are required' });
    }
    const activity = await Activity.create({ activityName, category, cost, duration, description });
    res.status(201).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed activities from data file
// @route   POST /api/activities/seed
// @access  Private/Admin
const seedActivities = async (req, res, next) => {
  try {
    await Activity.deleteMany({});
    const activities = await Activity.insertMany(activityData);
    res.json({ success: true, message: `${activities.length} activities seeded`, count: activities.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities, addActivity, seedActivities };
