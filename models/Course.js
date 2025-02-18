const mongoose = require('mongoose');
const redisClient = require('../utils/redisClient');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

// static method to get average course cost for a bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const aggregationObj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    if (aggregationObj.length === 0) {
      console.log('No aggregation object created!'.red.bgBlue);
    }
    const Bootcamp = mongoose.model('Bootcamp');
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      bootcampId,
      {
        averageCost: Math.ceil(aggregationObj[0].averageCost / 10) * 10, // get whole number in tens
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // if (updatedBootcamp) {
    //   console.log(
    //     `Bootcamp's averageCost updated to: ${updatedBootcamp.averageCost}`.blue
    //       .bold
    //   );
    // }
  } catch (err) {
    console.error(err);
  }
};

CourseSchema.statics.insertManyWithHook = async function (docs) {
  const courses = await this.insertMany(docs);

  // extract the unique bootcamp IDs from inserted courses
  const bootcampIds = [...new Set(courses.map((course) => course.bootcamp))];

  // recalculate average cost for each bootcamp
  for (const bootcampId of bootcampIds) {
    await this.getAverageCost(bootcampId);
  }

  return courses;
};

// call getAverage after save
CourseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost after deleteOne
CourseSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.constructor.getAverageCost(this.bootcamp);
  }
);

CourseSchema.pre('findOne', async function (next) {
  try {
    const queryCondition = this.getQuery();
    const courseId = queryCondition._id;

    let cachedCourse = await redisClient.get(courseId);

    if (cachedCourse) {
      console.log('Course saved in cache');
      return cachedCourse;
    } else {
      console.log('Searching the database for the course....');
      next();
    }
  } catch (error) {
    console.error(error.message);
  }
});

CourseSchema.post('findOne', async function (doc) {
  if (!doc) return;

  try {
    let storedCourse = await redisClient.get(doc._id.toString());

    if (!storedCourse) {
      storedCourse = await redisClient.set(
        doc._id.toString(),
        JSON.stringify(doc)
      );
      console.log('Course stored in cache');
    }
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = mongoose.model('Course', CourseSchema);
