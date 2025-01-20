// @desc    gets all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Private
exports.getBootcamps = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This gets all the bootcamps',
  });
};
