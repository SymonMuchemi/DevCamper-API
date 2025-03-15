const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    gets all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    gets a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review)
    return next(
      new ErrorResponse(`Could not get review with id: ${req.params.id}`, 404)
    );

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    creates a bootcamp review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private/User
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(
        `Could not find bootcamp with id: ${req.params.bootcampId}`,
        404
      )
    );

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    update a bootcamp review
// @route   PUT /api/v1/reviews/:id
// @access  Private/User
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    return next(
      new ErrorResponse(`Could not find review with id: ${req.params.id}`, 500)
    );

  // ensure review belongs to the user or the user is the admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to perform this action', 401)
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: updatedReview,
  });
});
