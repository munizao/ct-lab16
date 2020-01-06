require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Studio = require('../lib/models/Studio');
const { testSetup } = require('../test-setup/setup');


describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });
  let studios;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ studios } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('gets all studios', () => {
    return request(app)
      .get('/api/v1/studios/')
      .then(res => {
        studios.forEach((studio) => {
          expect(res.body).toContainEqual(
            {
              _id: studio._id.toString(),
              name: studio.name,
            });
        });
      });
  });
});
