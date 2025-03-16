const { createClient } = require('redis');

const STREAMNAME = 'devcamper:mail';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${
        process.env.REDIS_PORT || 6379
      }`,
    });

    this.client
      .connect()
      .then(() => console.log('Redis connection succeeded!'.green.inverse))
      .catch((err) => console.log(err.message));
  }

  isAlive() {
    return this.client.isReady;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, val) {
    const time = parseInt(process.env.REDIS_SET_EXPIRE, 10) || 3600;

    return this.client.set(key, val, { EX: time });
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
