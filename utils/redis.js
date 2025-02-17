const redis = require('redis');

// set up redis connection
exports.redisClient = redis.createClient();
