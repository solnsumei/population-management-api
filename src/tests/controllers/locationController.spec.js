import request from 'supertest';
import app from '../../app';
import Location from '../../models/Location';
import User from '../../models/User';

import locationData from '../data/locations';
import userData from '../data/users';

let server;
let baseUrl = '/api/v1';
let parentId;
let token;

beforeAll(async () => {
  server = app.callback();

  const userResponse = await request(server)
    .post(`${baseUrl}/register`).send(userData.valid);
  
  token = `Bearer ${userResponse.body.token}`;
});

afterAll(async () => {
  await Location.deleteMany({});
  await User.deleteMany({});
});

describe('Location Controller', () => {
  describe('GET /api/v1/locations', () => {
    test('should return locations', async () => {
      const response = await request(server).get(`${baseUrl}/locations`);

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });

  describe('POST /api/v1/locations', () => {
    test('should return user not authorized', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .send(locationData.invalid);

      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("User not authorized");
    });

    test('should return invalid data', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .set('Authorization', token)
        .send(locationData.invalid);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("name is not allowed to be empty");
    });

    test('should return invalid parentId', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .set('Authorization', token)
        .send({ ...locationData.valid, parentId: '5cec302eb5dca965e3f5b436' } );

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Parent id is invalid");
    });

    test('should create a location', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .set('Authorization', token)
        .send(locationData.valid);

      parentId = response.body._id;

      expect(response.status).toEqual(201);
      expect(response.body.name)
        .toEqual(locationData.valid.name);
      expect(response.body.population.male)
        .toEqual(locationData.valid.population.male);
    });

    test('should throw duplicate error', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .set('Authorization', token)
        .send(locationData.valid);

      expect(response.status).toEqual(409);
      expect(response.body.message)
        .toEqual("Location name submitted already exists");
    });

    test('should create a location with a parentId', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .set('Authorization', token)
        .send({ ...locationData.validChild, parentId });

      expect(response.status).toEqual(201);
      expect(response.body.name)
        .toEqual(locationData.validChild.name);
      expect(response.body.parent)
        .toEqual(parentId);
    });
  });

  describe('GET /api/v1/location/:id', () => {
    test('should return not found', async () => {
      const response = await request(server)
        .get(`${baseUrl}/location/5cec302eb5dca965e3f5b436`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Resource not found");
    });

    test('should return a location', async () => {
      const response = await request(server)
        .get(`${baseUrl}/location/${parentId}`);

      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(locationData.valid.name);
      expect(response.body.population.male)
        .toEqual((locationData.valid.population.male + locationData.validChild.population.male));
    });
  });

  describe('PUT /api/v1/location/:id', () => {
    test('should return invalid location Id', async () => {
      const response = await request(server)
        .put(`${baseUrl}/location/5cec302eb5dca965e3f5b436`)
        .set('Authorization', token)
        .send(locationData.validUpdate);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Resource not found");
    });

    test('should update the location', async () => {
      const response = await request(server)
        .put(`${baseUrl}/location/${parentId}`)
        .set('Authorization', token)
        .send(locationData.validUpdate);

      expect(response.status).toEqual(200);
      expect(response.body.population.male)
        .toEqual(locationData.validUpdate.population.male);
      expect(response.body.population.female)
        .toEqual(locationData.validUpdate.population.female);
    });
  });

  describe('DELETE /api/v1/location/:id', () => {
    test('should return invalid location Id', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/location/5cec302eb5dca965e3f5b436`)
        .set('Authorization', token);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Resource not found");
    });

    test('should delete the location', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/location/${parentId}`)
        .set('Authorization', token);

      const emptyResponse = await request(server)
        .get(`${baseUrl}/locations`);

      expect(response.status).toEqual(200);
      expect(response.body.message)
        .toEqual("Location deleted successfully");
      expect(emptyResponse.body.length)
        .toEqual(0);
    });
  });
});
