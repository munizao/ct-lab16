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
  let films;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ studios, films } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an studio', () => {
    const studio = {
      name: 'Pixar',
      address: {
        city: 'Hollywood',
        state: 'California',
        country: 'USA'
      }
    };

    return request(app)
      .post('/api/v1/studios/')
      .send(studio)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            name: studio.name,
            address: studio.address,
            __v: 0
          });
      });
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

  it('gets a studio by id', () => {
    return request(app)
      .get(`/api/v1/studios/${studios[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studios[0]._id.toString(),
          name: 'Dreamworks',
          address: {
            city: 'Hollywood',
            state: 'California',
            country: 'USA'
          },
          films: [
            {
              _id: films[0]._id.toString(),
              title: 'Young Einstein'
            }
          ]
        });
      });
  });
});
