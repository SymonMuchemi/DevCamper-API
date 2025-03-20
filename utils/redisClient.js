const { createClient } = require('redis');

const STREAMNAME = 'devcamper:mail';

class RedisClient {
  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      password: process.env.REDIS_PASSWORD
    });

    this.client
      .connect()
      .then(() => console.log('Redis connection succeeded!'.green.inverse))
      .catch((err) => console.log(`Redis connection error: ${err.message}`));
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
