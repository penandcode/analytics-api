const express = require('express');
const { collectEvent, getEventSummary, getUserStats } = require('../controllers/analyticsController');
const apiKeyAuth = require('../middlewares/apiKeyAuth');
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Submit analytics events (clicks, visits, etc.) from a website or app.
 *     description: This endpoint collects event data such as user clicks, page visits, and device details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - url
 *               - timestamp
 *             properties:
 *               event:
 *                 type: string
 *                 description: The name of the event (e.g., "click", "form_submission").
 *               url:
 *                 type: string
 *                 description: The URL where the event occurred.
 *               referrer:
 *                 type: string
 *                 description: The URL that referred the user to the current page.
 *               device:
 *                 type: string
 *                 description: The type of device (e.g., "mobile", "desktop").
 *               ipAddress:
 *                 type: string
 *                 description: The user's IP address.
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp of when the event occurred.
 *               metadata:
 *                 type: object
 *                 description: Additional device-specific metadata (e.g., browser, OS, screen size).
 *                 properties:
 *                   browser:
 *                     type: string
 *                   os:
 *                     type: string
 *                   screenSize:
 *                     type: string
 *     responses:
 *       201:
 *         description: Successfully collected the event data.
 *       400:
 *         description: Bad Request (invalid or missing data).
 *       500:
 *         description: Internal Server Error.
 */
router.post('/collect', apiKeyAuth, rateLimiter(5, 1), collectEvent);

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Retrieves an analytics summary for a specific event type.
 *     description: This endpoint aggregates data by event type (e.g., clicks, form submissions) and provides summary statistics.
 *     parameters:
 *       - name: event
 *         in: query
 *         required: true
 *         description: The event name (e.g., "click", "form_submission").
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         required: false
 *         description: |
 *           The start date to filter events. Date should be in the format YYYY-MM-DD.
 *           Example: `2024-02-15`.
 *         schema:
 *           type: string
 *       - name: endDate
 *         in: query
 *         required: false
 *         description: |
 *           The end date to filter events. Date should be in the format YYYY-MM-DD.
 *           Example: `2024-02-20`.
 *         schema:
 *           type: string
 *       - name: app_id
 *         in: query
 *         required: false
 *         description: |
 *           The ID of the app to filter events for.
 *           If not provided, data for all apps is returned.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved event summary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   description: The event name.
 *                 count:
 *                   type: integer
 *                   description: Total number of occurrences for the event.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users for the event.
 *                 deviceData:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: Breakdown of event occurrences by device type (e.g., "mobile", "desktop").
 *       400:
 *         description: Bad Request (missing or invalid parameters).
 *       500:
 *         description: Internal Server Error.
 */
router.get('/event-summary', apiKeyAuth, rateLimiter(50, 600), getEventSummary);

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Retrieves statistics based on unique users, including event counts and device details.
 *     description: This endpoint provides stats for a specific user, such as event counts, recent events, and device details.
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: The unique user ID (e.g., IP address).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user stats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique identifier for the user (e.g., IP address).
 *                 totalEvents:
 *                   type: integer
 *                   description: Total number of events the user triggered.
 *                 deviceDetails:
 *                   type: object
 *                   properties:
 *                     browser:
 *                       type: string
 *                     os:
 *                       type: string
 *                 ipAddress:
 *                   type: string
 *       400:
 *         description: Bad Request (missing or invalid userId).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/user-stats', apiKeyAuth, rateLimiter(50, 600), getUserStats);




module.exports = router;
