const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    gets all courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    gets a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description user',
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

// @desc    create a course
// @route   Post /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  // only bootcamp owner or admin can create a course
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User is not authorized to add a course to bootcamp ${bootcamp.id}`,
        403
      )
    );
  }

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cound not find bootcamp with id: ${req.params.bootcampId}`
      ),
      404
    );
  }

  req.body.bootcamp = req.params.bootcampId;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'user',
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Cound not find course with id: ${req.params.bootcampId}`
      ),
      404
    );
  }

  // only course owner or admin can update the course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User is unauthorized to update this bootcamp`, 403)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @route   Delete /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  // only course owner or admin can delete the course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User is unauthorized to update this bootcamp`, 403)
    );
  }

  if (!course) {
    return next(
      new ErrorResponse(`Cound not find course with id: ${req.params.id}`),
      404
    );
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
