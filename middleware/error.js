const errorHandler = (error, req, res, next) => {
  console.log("Error is caught by the middleware!".red.bold);

  res.status(500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
