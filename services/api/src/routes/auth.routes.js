import express from 'express';
import { HHService } from '../services/hh.service.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get authorization URL
router.get('/auth-url', (req, res) => {
  try {
    const authUrl = HHService.getAuthUrl();
    logger.info('Generated auth URL:', { authUrl });
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    logger.error('Error generating auth URL:', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      logger.warn('Callback received without authorization code');
      return res.status(400).json({ 
        success: false, 
        error: 'Authorization code is missing' 
      });
    }

    const tokenData = await HHService.getAccessToken(code);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI-HR Authentication</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .message {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>Authentication Successful!</h2>
            <p>You can close this window now.</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'HH_AUTH_SUCCESS',
                data: ${JSON.stringify(tokenData)}
              }, '${process.env.ALLOWED_ORIGIN}');
              setTimeout(() => window.close(), 2000);
            }
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
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #fff0f0;
            }
            .message {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              text-align: center;
              color: #dc3545;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>Authentication Failed</h2>
            <p>${error.message}</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'HH_AUTH_ERROR',
                error: ${JSON.stringify(error.message)}
              }, '${process.env.ALLOWED_ORIGIN}');
              setTimeout(() => window.close(), 3000);
            }
          </script>
        </body>
      </html>
    `);
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth service is working' });
});

export default router;