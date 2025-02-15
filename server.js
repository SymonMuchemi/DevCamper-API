const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');

const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

// import routers
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// body parser
app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// uploading files
app.use(fileupload());

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
