const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Courses');

// @desc    gets all courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let queury;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    gets a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`Cound not find course with id: ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
