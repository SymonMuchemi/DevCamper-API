const jwt = require('jsonwebtoken');

const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  // TODO: Research how to use cookie for authorization
  //   else if (req.cookie.token) {
  //     token = req.cookie.token;
  //   }

  // ensure token exists
  if (!token) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  try {
    // decode token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }
});

// Todo: something
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Unauthorized access', 403));
    }
    next();
  };
};

