const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    // Melakukan koneksi secara asynchronous
    this._client.connect();
  }

  async set(key, value, expirationInSeconds = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

  async delete(key) {
    return await this._client.del(key);
  }
}

module.exports = CacheService;