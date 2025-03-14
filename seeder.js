const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to DB with increased timeout
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// import data to database
const importData = async () => {
  try {
    console.log('⚪ Importing bootcamps...'.yellow);
    await Bootcamp.create(bootcamps);

    console.log('⚪ Importing courses...'.yellow);
    await Course.insertManyWithHook(courses);

    console.log('⚪ Importing users...'.yellow);
    await User.create(users);

    console.log('⚪ Importing reviews...'.yellow);
    await Review.create(reviews);

    console.log('✅ Data imported'.green);

    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Course.deleteMany();
    await Bootcamp.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('🛑 Data Destroyed'.red);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const importCommand = '-i' || '--import';
const deleteCommand = '-d' || '--delete';

if (process.argv[2] === importCommand) {
  importData();
} else if (process.argv[2] === deleteCommand) {
  deleteData();
} else {
  console.log(
    'Usage: node seeder -i | --import to import data, -d | --delete to delete data'
  );
  process.exit();
}
