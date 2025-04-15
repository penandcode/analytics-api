// tests/rateLimit.test.js
const request = require('supertest');
const app = require('../src/app');  // Import your Express app

describe('Rate limiting', () => {
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

  it('should return 429 when the rate limit is exceeded', async () => {
    // Simulate multiple requests to exceed the rate limit
    console.log(apiKey);
    
    for (let i = 0; i < 15; i++) {
      await request(app)
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
    }

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

    expect(response.status).toBe(429);  // Too many requests
    expect(response.body.error).toBe('Rate limit exceeded');
  });
});
