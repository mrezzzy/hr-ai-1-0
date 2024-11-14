export const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('Received webhook data:', webhookData);
    
    // Add your webhook processing logic here
    
    res.status(200).json({
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getWebhookStatus = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};