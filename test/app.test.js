const app = require('../app');
const request = require('supertest');

describe('GET /', () => {
  it('responds with Hello message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Hello from our demo app!');
  });
});