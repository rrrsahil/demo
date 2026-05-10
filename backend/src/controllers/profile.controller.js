const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = {};
  if (name) updateData.name = name;
  if (profileImage) updateData.profileImage = profileImage;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated'));
});

// @desc    Change password
// @route   PUT /api/profile/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json(new ApiResponse(400, null, 'Current and new passwords are required'));
  }
  if (newPassword.length < 6) {
    return res.status(400).json(new ApiResponse(400, null, 'New password must be at least 6 characters'));
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json(new ApiResponse(400, null, 'Current password is incorrect'));
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

module.exports = { updateProfile, changePassword };
