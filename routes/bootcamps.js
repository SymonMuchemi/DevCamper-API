const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// import course router
const courseRouter = require('./courses');

const router = express.Router();

// reroute to course router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id/photo').put(uploadBootcampPhoto);

router
  .route('/:id')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
