const { Op, fn, col } = require('sequelize');
const Event = require('../models/Event');
const { getCache, cacheResponse } = require('../utils/cache');

const collectEvent = async (req, res) => {
  const { appId } = req.appData;

  const {
    event,
    url,
    referrer,
    device,
    ipAddress,
    timestamp,
    metadata
  } = req.body;

  if (!event || !url || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields: event, url, timestamp' });
  }

  try {
    await Event.create({
      appId,
      event,
      url,
      referrer,
      device,
      ipAddress,
      timestamp,
      metadata
    });

    res.status(200).json({ message: 'Event collected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to collect event' });
  }
};

const getEventSummary = async (req, res) => {
  const { event, startDate, endDate, app_id } = req.query;

  if (!event) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  const cacheKey = `event-summary:${event}:${startDate || ''}:${endDate || ''}:${app_id || ''}`;

  // Check cache first
  const cachedSummary = await getCache(cacheKey);
  if (cachedSummary) {
    console.log('Cache hit for event summary');
    return res.json(cachedSummary);
  }

  try {
    // Build filter query
    const where = { event };
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }
    if (app_id) {
      where.appId = app_id;
    } else {
      where.appId = req.appData.appId;
    }

    // Aggregate data
    const [countResult, uniqueUsersResult, deviceBreakdown] = await Promise.all([
      Event.count({ where }),
      Event.count({ where, distinct: true, col: 'ipAddress' }),
      Event.findAll({
        where,
        attributes: ['device', [fn('COUNT', col('device')), 'count']],
        group: ['device'],
      })
    ]);

    const deviceData = {};
    deviceBreakdown.forEach((row) => {
      deviceData[row.device || 'unknown'] = parseInt(row.dataValues.count);
    });

    const summary = {
      event,
      count: countResult,
      uniqueUsers: uniqueUsersResult,
      deviceData
    };

    // Cache the result for future requests
    await cacheResponse(cacheKey, summary);

    res.json(summary);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching event summary' });
  }
};

const getUserStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId (ipAddress) is required' });
  }

  const cacheKey = `user-stats:${userId}:${req.appData.appId}`;

  // Check cache first
  const cachedStats = await getCache(cacheKey);
  if (cachedStats) {
    console.log('Cache hit for user stats');
    return res.json(cachedStats);
  }

  try {
    const events = await Event.findAll({
      where: {
        ipAddress: userId,
        appId: req.appData.appId
      },
      order: [['timestamp', 'DESC']],
      limit: 10
    });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No data found for this user' });
    }

    const totalEvents = events.length;
    const deviceDetails = events[0].metadata || {};
    const ipAddress = userId;

    const recentEvents = events.map(event => ({
      event: event.event,
      timestamp: event.timestamp,
      url: event.url
    }));

    const stats = {
      userId,
      totalEvents,
      deviceDetails,
      ipAddress,
      recentEvents
    };

    // Cache the result for future requests
    await cacheResponse(cacheKey, stats);

    res.json(stats);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user stats' });
  }
};


module.exports = { collectEvent, getEventSummary, getUserStats };
