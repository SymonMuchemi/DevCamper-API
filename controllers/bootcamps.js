// @desc    gets all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This gets all the bootcamps',
  });
};

// @desc    gets a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Show bootcamp ${req.params.id}`,
  });
};

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create new bootcamp',
  });
};

// @desc    updates a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Updates bootcamp: ${req.params.id}`,
  });
};

// @desc    deletes a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Public
exports.deleteBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Deletes bootcamp ${req.params.id}`,
  });
};
