const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const redisClient = require('../utils/redisClient');
const crypto = require('crypto');

// @desc    register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc    login a new user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide a valid email and password', 400)
    );
  }

  // check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // check if password matches
  const isMatch = user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    get currect logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    get currect logged in user
// @route   GET /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetpassword = asyncHandler(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorResponse('Invalid token', 400));

  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   GET /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`No user found with email: ${req.body.email}`, 404)
    );
  }

  const resetToken = user.getPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `${resetUrl}`;

  try {
    await redisClient.writeToMailStream(
      user.email,
      'Password Reset Token',
      message
    );
    res.status(200).json({ success: true, data: 'Email queued' });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Error writing to mail stream`, 500));
  }
});

// generate token and set cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expire: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
