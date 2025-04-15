const express = require('express');
const {
  registerApp,
  getApiKey,
  revokeApiKey
} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new website/app and generates an API key.
 *     description: This endpoint registers a new website/app for analytics and returns an API key.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the website/app.
 *               url:
 *                 type: string
 *                 description: The URL of the website/app.
 *     responses:
 *       201:
 *         description: Successfully registered and API key generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: The generated API key.
 *       400:
 *         description: Bad Request (e.g., missing parameters).
 *       500:
 *         description: Internal Server Error.
 */
router.post('/register', registerApp);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Retrieves the API key for a registered app.
 *     description: This endpoint returns the API key for a registered website/app.
 *     responses:
 *       200:
 *         description: Successfully retrieved the API key.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: The API key for the app.
 *       401:
 *         description: Unauthorized (API key missing or invalid).
 *       404:
 *         description: Not Found (app not registered).
 *       500:
 *         description: Internal Server Error.
 */
router.get('/api-key', getApiKey);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revokes an API key to prevent further use.
 *     description: This endpoint revokes an API key for a website/app, disabling its ability to make requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apiKey
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: The API key to be revoked.
 *     responses:
 *       200:
 *         description: Successfully revoked the API key.
 *       400:
 *         description: Bad Request (missing or invalid API key).
 *       500:
 *         description: Internal Server Error.
 */
router.post('/revoke', revokeApiKey);

module.exports = router;
