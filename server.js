const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env'});

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`App running in ${NODE_ENV} mode at http://127.0.0.1:${PORT}`);
})
