const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const transporter = require('../configs/mail');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));
  }
  if (password.length < 6) {
    return res.status(400).json(new ApiResponse(400, null, 'Password must be at least 6 characters'));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json(new ApiResponse(400, null, 'Email already registered'));
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json(new ApiResponse(201, {
    token,
    user: { _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, role: user.role }
  }, 'Registration successful'));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'Email and password are required'));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid email or password'));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid email or password'));
  }

  const token = generateToken(user._id);

  res.status(200).json(new ApiResponse(200, {
    token,
    user: { _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, role: user.role }
  }, 'Login successful'));
});

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }, "User profile fetched"));
});

// @desc    Forgot password — send reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiResponse(400, null, 'Email is required'));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'No account found with that email'));
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expiry
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Frontend reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Email template
  const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Traveloop Password Reset</h2>

      <p>You requested a password reset.</p>

      <p>
        Click the button below to reset your password:
      </p>

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
          margin-top:10px;
        "
      >
        Reset Password
      </a>

      <p style="margin-top:20px;">
        This link will expire in 10 minutes.
      </p>

      <p>
        If you did not request this, please ignore this email.
      </p>
    </div>
  `;

  try {
    // Send mail
    await transporter.sendMail({
      from: `Traveloop <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Traveloop Password Reset',
      html: message,
    });

    res.status(200).json(new ApiResponse(200, null, 'Password reset link sent to your email'));
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    return res.status(500).json(new ApiResponse(500, null, 'Email could not be sent'));
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired reset token'));
  }

  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json(new ApiResponse(400, null, 'Password must be at least 6 characters'));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json(new ApiResponse(200, { token }, 'Password reset successful'));
});

module.exports = { register, login, getProfile, forgotPassword, resetPassword };
