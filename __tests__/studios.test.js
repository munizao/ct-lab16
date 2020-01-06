require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });
  let studios;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    studios = await Studio.create([
      {
        name: 'Dreamworks',
        address: {
          city: 'Hollywood',
          state: 'California',
          country: 'USA'
        }
      },
      {
        name: 'Laika',
        address: {
          city: 'Portland',
          state: 'Oregon',
          country: 'USA'
        }
      }
    ]);
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
