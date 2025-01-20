const express = require('express');
const { getBootcamps } = require('../controllers/bootcamp');

const router = express.Router();

router.route('/').get(getBootcamps);

module.exports = router;
