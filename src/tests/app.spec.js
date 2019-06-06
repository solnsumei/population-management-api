import request from 'supertest';
import app from '../app';

let server;

beforeAll(() => {
  server = app.callback();
});

describe('Basic routes', () => {
  test('should show home route', async () => {
    const response = await request(server).get('/');

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Welcome to Population Management API');
  
  });

  test('should show not found route', async () => {
    const response = await request(server).post('/');

    expect(response.status).toEqual(405);
    expect(response.body.message).toEqual('Route not found');
  });

  test('should show not found API route', async () => {
    const response = await request(server).get('/api/v1/hello');

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Route not found');
  });

  test('should show not found API route', async () => {
    const response = await request(server).put('/api/v1/locations');

    expect(response.status).toEqual(405);
    expect(response.body.message).toEqual('Route not found');
  });
});