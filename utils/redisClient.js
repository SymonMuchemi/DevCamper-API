const { createClient } = require('redis');

const STREAMNAME = 'devcamper:mail'

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client
      .connect()
      .then(console.log('Redis connection succeeded!'.green.inverse))
      .catch(console.error); // Explicitly connect the client
  }

  isAlive() {
    return this.client.isReady; // Correct way to check readiness in Redis v4+
  }

  async get(key) {
    return this.client.get(key); // No need for promisify in Redis v4+
  }

  async set(key, val) {
    const time = parseInt(process.env.REDIS_SET_EXPIRE, 10) || 3600;

    return this.client.set(key, val, { EX: time }); // Correct Redis v4+ syntax
  }

  async del(key) {
    return this.client.del(key);
  }

  async writeToMailStream(address, subject, body) {
    return this.client.XADD(STREAMNAME, '*', {
      email: address,
      subject: subject,
      body: body,
    });
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
