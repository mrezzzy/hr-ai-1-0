import fetch from 'node-fetch';
import logger from '../config/logger.js';
import { HH_CONFIG } from '../config/constants.js';
import TokenService from './token.service.js';

export class HHService {
  static async getAuthUrl(userId, returnUrl) {
    try {
      const stateToken = Math.random().toString(36).substring(7);
      
      await TokenService.storeReturnUrl(stateToken, JSON.stringify({
        returnUrl: returnUrl || 'https://app.ai-hr.ru/',
        userId
      }));

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: HH_CONFIG.CLIENT_ID,
        redirect_uri: HH_CONFIG.REDIRECT_URI,
        state: stateToken
      });

      return `https://hh.ru/oauth/authorize?${params.toString()}`;
    } catch (error) {
      logger.error('Error generating auth URL:', error);
      throw error;
    }
  }

  static async getAccessToken(code, state) {
    try {
      const response = await fetch('https://api.hh.ru/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': HH_CONFIG.USER_AGENT
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: HH_CONFIG.CLIENT_ID,
          client_secret: HH_CONFIG.CLIENT_SECRET,
          code,
          redirect_uri: HH_CONFIG.REDIRECT_URI
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to get access token');
      }

      const tokenData = await response.json();
      const stateData = await TokenService.getReturnUrl(state);
      
      if (stateData) {
        const { userId } = JSON.parse(stateData);
        await TokenService.storeTokens(userId, tokenData);
      }

      return tokenData;
    } catch (error) {
      logger.error('Error getting access token:', error);
      throw error;
    }
  }

  static async getResume(resumeId, token) {
    try {
      const response = await fetch(`${HH_CONFIG.API_URL}/resumes/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': HH_CONFIG.USER_AGENT
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Failed to fetch resume');
      }

      return response.json();
    } catch (error) {
      logger.error('Error fetching resume:', error);
      throw error;
    }
  }

  static async getResumeContacts(resumeId, token) {
    try {
      const response = await fetch(`${HH_CONFIG.API_URL}/resumes/${resumeId}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': HH_CONFIG.USER_AGENT
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Failed to fetch resume contacts');
      }

      return response.json();
    } catch (error) {
      logger.error('Error fetching resume contacts:', error);
      throw error;
    }
  }
}