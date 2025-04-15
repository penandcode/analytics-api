const App = require('../models/App');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key in headers' });
  }

  try {
    const app = await App.findOne({ where: { apiKey, isActive: true } });

    if (!app) {
      return res.status(403).json({ error: 'Invalid or revoked API key' });
    }

    const now = new Date();
    if (app.expirationDate && new Date(app.expirationDate) < now) {
      return res.status(403).json({ error: 'API key has expired' });
    }

    // Attach app info to request
    req.appData = {
      appId: app.id,
      name: app.name,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = apiKeyAuth;
