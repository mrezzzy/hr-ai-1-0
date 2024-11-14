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

  async storeTokens(userId, tokens) {
    try {
      await this.client.hSet(`hh:${userId}`, {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + (tokens.expires_in * 1000)
      });
    } catch (error) {
      logger.error('Error storing tokens:', error);
      throw error;
    }
  }

  async getAccessToken(userId) {
    try {
      const tokens = await this.client.hGetAll(`hh:${userId}`);
      if (!tokens.access_token) {
        throw new Error('No access token found');
      }
      return tokens.access_token;
    } catch (error) {
      logger.error('Error getting access token:', error);
      throw error;
    }
  }

  async storeReturnUrl(state, data) {
    try {
      await this.client.set(`state:${state}`, data, {
        EX: 600 // 10 minutes
      });
    } catch (error) {
      logger.error('Error storing return URL:', error);
      throw error;
    }
  }

  async getReturnUrl(state) {
    try {
      return await this.client.get(`state:${state}`);
    } catch (error) {
      logger.error('Error getting return URL:', error);
      return null;
    }
  }
}

export default new TokenService();