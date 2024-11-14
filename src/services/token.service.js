import { createClient } from 'redis';
import logger from '../config/logger.js';

class TokenService {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    });
    
    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.connect();
  }

  async connect() {
    await this.client.connect();
  }

  async storeUserData(userId, data) {
    try {
      await this.client.hSet(`user:${userId}`, data);
    } catch (error) {
      logger.error('Error storing user data:', error);
      throw error;
    }
  }

  async getUserData(userId) {
    try {
      const data = await this.client.hGetAll(`user:${userId}`);
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No user data found');
      }
      return data;
    } catch (error) {
      logger.error('Error getting user data:', error);
      throw error;
    }
  }
}

export default new TokenService();