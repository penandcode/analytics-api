const App = require('../models/App');
const { v4: uuidv4 } = require('uuid');

// REGISTER NEW APP
const registerApp = async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'App name and url are required' });

  try {
    const apiKey = uuidv4();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const newApp = await App.create({ name, apiKey, expirationDate });
    res.status(200).json({
      message: 'App registered successfully',
      appId: newApp.id,
      apiKey: newApp.apiKey,
      expirationDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register app' });
  }
};

// GET EXISTING API KEY
const getApiKey = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'App name is required' });

  try {
    const app = await App.findOne({ where: { name, isActive: true } });
    if (!app) return res.status(404).json({ error: 'Active app not found' });

    res.json({
      name: app.name,
      apiKey: app.apiKey,
      expirationDate: app.expirationDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
};

// REVOKE API KEY
const revokeApiKey = async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'Invalid API key' });

  try {
    const app = await App.findOne({ where: { apiKey } });
    if (!app) return res.status(400).json({ error: 'Invalid API key' });

    app.isActive = false;
    await app.save();

    res.json({ message: 'API key revoked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
};

module.exports = {
  registerApp,
  getApiKey,
  revokeApiKey
};
