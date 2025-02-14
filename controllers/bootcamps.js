const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    gets all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy request query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // loop over remove fields and remove them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`);

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query.skip(startIndex).limit(limit);

  // set select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query.select(fields);
  }

  // set sort fields
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query.sort(fields);
  } else {
    query.sort('-createdAt'); // sort from newest to oldest
  }

  // executing query
  const bootcamps = await query;

  // pagination results
  let pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    gets a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    updates a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    deletes a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get latitude and longitude
  const loc = await geocoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  // calculate the radius
  // divide distance by radius of the earth
  // Earth radius => 3,963 miles or 6,378 kilometres
  const radius = distance / 3963; // miles

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
