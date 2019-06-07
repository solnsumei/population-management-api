import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

import userData from '../data/users';

let server;
let baseUrl = '/api/v1';

beforeAll(async () => {
  server = app.callback();
});

afterAll(async () => {
  await User.deleteMany({});
});

describe('User Controller', () => {
  describe('POST /api/v1/register', () => {
    test('should return invalid data', async () => {
      const response = await request(server)
        .post(`${baseUrl}/register`)
        .send(userData.invalid);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("email must be a valid email");
    });

    test('should create a user', async () => {
      const response = await request(server)
        .post(`${baseUrl}/register`)
        .send(userData.valid);

      expect(response.status).toEqual(201);
      expect(response.body.email)
        .toEqual(userData.valid.email);
      expect(response.body.token)
        .toBeDefined()
    });

    test('should throw duplicate error', async () => {
      const response = await request(server)
        .post(`${baseUrl}/register`)
        .send(userData.valid);

      expect(response.status).toEqual(409);
      expect(response.body.message)
        .toEqual("User with this email already exist");
    });
  });

  describe('POST /api/v1/login', () => {
    test('should return invalid data', async () => {
      const response = await request(server)
        .post(`${baseUrl}/login`)
        .send(userData.invalid);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("email must be a valid email");
    });

    test('should login a user', async () => {
      const response = await request(server)
        .post(`${baseUrl}/login`)
        .send(userData.valid);

      expect(response.status).toEqual(200);
      expect(response.body.email)
        .toEqual(userData.valid.email);
      expect(response.body.token)
        .toBeDefined()
    });

    test('should return user or password is incorrect', async () => {
      const response = await request(server)
        .post(`${baseUrl}/login`)
        .send({ ...userData.valid, password: 'solllll' });

      expect(response.status).toEqual(401);
      expect(response.body.message)
        .toEqual("Email and/or password is incorrect");
    });
  });
});
