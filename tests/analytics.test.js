// tests/analytics.test.js
const request = require('supertest');
const app = require('../src/app');  // Import your Express app
describe('POST /api/analytics/collect', () => {
  let apiKey;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test App',
        url: 'https://testapp.com',
      });
    apiKey = response.body.apiKey;  // Save the API key
  });

  it('should collect event data successfully', async () => {
    const response = await request(app)
      .post('/api/analytics/collect')
      .set('x-api-key', `${apiKey}`)
      .send({
        event: 'button_click',
        url: 'https://testapp.com/home',
        referrer: 'https://google.com',
        device: 'mobile',
        ipAddress: '192.168.1.1',
        timestamp: '2024-04-15T12:34:56Z',
        metadata: {
          browser: 'Chrome',
          os: 'Android',
          screenSize: '1080x1920',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event collected successfully');
  });

  it('should return a 400 error if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/analytics/collect')
      .set('x-api-key', `${apiKey}`)
      .send({
        event: 'button_click',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields: event, url, timestamp');
  });
});

// tests/analytics.test.js
describe('GET /api/analytics/event-summary', () => {
  let apiKey;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test App',
        url: 'https://testapp.com',
      });
    apiKey = response.body.apiKey;  // Save the API key
  });

  it('should return event summary successfully', async () => {
    const response = await request(app)
      .get('/api/analytics/event-summary')
      .set('x-api-key', `${apiKey}`)
      .query({
        event: 'button_click',
        startDate: '2024-04-10',
        endDate: '2024-04-15',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('event');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('uniqueUsers');
    expect(response.body).toHaveProperty('deviceData');
  });

  it('should return 400 if missing required query parameters', async () => {
    const response = await request(app)
      .get('/api/analytics/event-summary')
      .set('x-api-key', `${apiKey}`)
      .query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Event name is required');
  });
});
