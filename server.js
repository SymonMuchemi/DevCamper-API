const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const bootcamps = require('./routes/bootcamp');

app.use(morgan('dev'));
app.use('api/v1/bootcamp', bootcamps);

app.get('/', (req, res) => {
  res.status(200).send('<H1>Hello from Express</H1>');
});

app.get('/api/v1/bootcamps', (req, res) => {
  res.status(200).send('Gets all bootcamps');
});

app.listen(PORT, () => {
  console.log(`App running in ${NODE_ENV} mode at http://127.0.0.1:${PORT}`);
});
