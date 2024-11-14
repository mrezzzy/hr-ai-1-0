import express from 'express';
import logger from '../config/logger.js';
import { HHService } from '../services/hh.service.js';
import TokenService from '../services/token.service.js';

const router = express.Router();

router.get('/auth-url', (req, res) => {
  try {
    const { returnUrl, adaloUserId } = req.query;
    
    if (!adaloUserId) {
      return res.status(400).json({
        success: false,
        error: 'Adalo user ID is required'
      });
    }

    const authUrl = HHService.getAuthUrl();
    const stateToken = Math.random().toString(36).substring(7);
    
    TokenService.storeReturnUrl(stateToken, JSON.stringify({
      returnUrl: returnUrl?.trim() || 'https://app.ai-hr.ru/',
      adaloUserId: adaloUserId.trim()
    }));

    logger.info('Generated auth URL:', { authUrl, stateToken, adaloUserId });
    
    const finalAuthUrl = `${authUrl}&state=${stateToken}`;
    
    res.json({
      success: true,
      authUrl: finalAuthUrl
    });
  } catch (error) {
    logger.error('Error generating auth URL:', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
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

    const { returnUrl, adaloUserId } = JSON.parse(stateData);

    const tokenData = await HHService.getAccessToken(code);
    logger.info('Successfully obtained access token');

    await TokenService.storeTokens(adaloUserId, tokenData);

    await TokenService.removeReturnUrl(state);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI-HR Authentication</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .message {
              background: white;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.1);
              text-align: center;
            }
            .success-icon {
              color: #2e7d32;
              font-size: 48px;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <div class="success-icon">✓</div>
            <h2>Авторизация успешна!</h2>
            <p>Возвращаемся в приложение...</p>
          </div>
          <script>
            window.location.href = "${returnUrl}";
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    logger.error('HH callback error:', { error: error.message });
    
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
            }
            .error-icon {
              color: #c62828;
              font-size: 48px;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <div class="error-icon">✕</div>
            <h2>Ошибка авторизации</h2>
            <p>${error.message}</p>
          </div>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  }
});

export default router;