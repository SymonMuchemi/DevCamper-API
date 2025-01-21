const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.status(200).send('<H1>Hello from Express</H1>');
});

app.listen(PORT, () => {
  console.log(`App running in ${NODE_ENV} mode at http://127.0.0.1:${PORT}`);
});
