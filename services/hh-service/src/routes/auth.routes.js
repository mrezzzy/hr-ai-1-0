import express from 'express';
import { HHService } from '../services/hh.service.js';
import logger from '../config/logger.js';
import TokenService from '../services/token.service.js';

const router = express.Router();

router.get('/auth-url', async (req, res) => {
  try {
    const { userId, returnUrl } = req.query;
    
    if (!userId) {
      return res.json({
        success: false,
        error: {
          message: 'User ID is required'
        }
      });
    }

    const authUrl = await HHService.getAuthUrl(userId, returnUrl);
    
    res.json({
      success: true,
      data: { authUrl }
    });
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    res.json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      throw new Error('Authorization code is missing');
    }

    const stateData = await TokenService.getReturnUrl(state);
    if (!stateData) {
      throw new Error('Invalid state token');
    }

    const { returnUrl } = JSON.parse(stateData);

    await HHService.getAccessToken(code, state);

    // Redirect to the return URL after successful authorization
    res.redirect(returnUrl);
  } catch (error) {
    logger.error('Auth callback error:', error);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI-HR Authentication Error</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #fff0f0;
            }
            .message {
              background: white;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.1);
              text-align: center;
              color: #dc3545;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>Ошибка авторизации</h2>
            <p>${error.message}</p>
          </div>
        </body>
      </html>
    `);
  }
});

export default router;