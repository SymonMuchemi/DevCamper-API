const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const colors = require('colors');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { redisClient } = require('./utils/redisClient');

// import routers
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// dotenv.config({ path: './config/config.env' });
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// body parser
app.use(express.json());

// add cookie parser
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// Prevent XSS
app.use(xss());

// set up rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ten minutes
  max: 100,
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// set up cors
app.use(cors());

if (NODE_ENV === 'development') {
  const morgan = require('morgan');

  app.use(morgan('dev'));
}

// uploading files
app.use(fileupload());

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).send('<H1>Hello from Express</H1>');
});

const server = app.listen(PORT, () => {
  console.log(
    `App running in ${NODE_ENV} mode at http://127.0.0.1:${PORT}`.yellow.bold
  );
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
