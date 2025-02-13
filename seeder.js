const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// import data to database
const importData = async () => {
  try {
    console.log('Import bootcamps...'.yellow);
    await Bootcamp.create(bootcamps);

    console.log('Data imported...'.green.inverse);

    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const importCommand = '-i' || '--import';
const deleteCommand = '-d' || '--delete';

if (process.argv[2] === importCommand) {
  importData();
} else if (process.argv[2] === deleteCommand) {
  deleteData();
} else {
  console.log('Usage: node seeder -i | --import to import data, -d | --delete to delete data');
  process.exit();
}
