// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');  // Ensure this path is correct
const sequelize = require('../src/config/db'); // Import your database connection

describe('POST /api/auth/register', () => {
  it('should register a new website/app and return an API key', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test App',
        url: 'https://testapp.com',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('apiKey');
    expect(typeof response.body.apiKey).toBe('string');
  });

  it('should return a 400 error if name or url is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
      });

    expect(response.status).toBe(400);
  });
});

// tests/auth.test.js
describe('POST /api/auth/revoke', () => {
  let apiKey;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test App',
        url: 'https://testapp.com',
      });
    apiKey = response.body.apiKey;  // Save the API key for use in subsequent requests
  });

  it('should revoke the API key successfully', async () => {
    const response = await request(app)
      .post('/api/auth/revoke')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ apiKey });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API key revoked successfully');
  });

  it('should return a 400 error if the API key is invalid or missing', async () => {
    const response = await request(app)
      .post('/api/auth/revoke')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ apiKey:'invalid-api-key' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid API key');
  });
});
