import request from 'supertest';
import app from '../../app';
import Location from '../../models/Location';

import locationData from '../data/locations';

let server;
let baseUrl = '/api/v1';
let parentId;

beforeAll(() => {
  server = app.callback();
});

afterAll(async () => {
  await Location.deleteMany({});
});

describe('Location Controller', () => {
  describe('GET /locations', () => {
    test('should return locations', async () => {
      const response = await request(server).get(`${baseUrl}/locations`);

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });

  describe('POST /locations', () => {
    test('should return invalid data', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .send(locationData.invalid);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("name is not allowed to be empty");
    });

    test('should return invalid parentId', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .send({ ...locationData.valid, parentId: '5cec302eb5dca965e3f5b436' } );

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Parent id is invalid");
    });

    test('should create a location', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
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
        .send(locationData.valid);

      expect(response.status).toEqual(409);
      expect(response.body.message)
        .toEqual("Location name submitted already exists");
    });

    test('should create a location with a parentId', async () => {
      const response = await request(server)
        .post(`${baseUrl}/locations`)
        .send({ ...locationData.validChild, parentId });

      expect(response.status).toEqual(201);
      expect(response.body.name)
        .toEqual(locationData.validChild.name);
      expect(response.body.parent)
        .toEqual(parentId);
    });
  });

  describe('GET /location/:id', () => {
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

  describe('PUT /location/:id', () => {
    test('should return invalid location Id', async () => {
      const response = await request(server)
        .put(`${baseUrl}/location/5cec302eb5dca965e3f5b436`)
        .send(locationData.validUpdate);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Resource not found");
    });

    test('should update the location', async () => {
      const response = await request(server)
        .put(`${baseUrl}/location/${parentId}`)
        .send(locationData.validUpdate);

      expect(response.status).toEqual(200);
      expect(response.body.population.male)
        .toEqual(locationData.validUpdate.population.male);
      expect(response.body.population.female)
        .toEqual(locationData.validUpdate.population.female);
    });
  });

  describe('DELETE /location/:id', () => {
    test('should return invalid location Id', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/location/5cec302eb5dca965e3f5b436`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Resource not found");
    });

    test('should delete the location', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/location/${parentId}`);

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
