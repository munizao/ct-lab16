require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');


describe('film routes', () => {
  beforeAll(() => {
    connect();
  });
  let films;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ films } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('gets all films', () => {
    return request(app)
      .get('/api/v1/films/')
      .then(async res => {
        await Promise.all(films.map(async(film) => {
          await film.populate('studio', 'name').execPopulate();
          const filmObj = film.toObject();
          return expect(res.body).toContainEqual(
            {
              _id: filmObj._id.toString(),
              title: filmObj.title,
              released: filmObj.released,
              studio: {
                _id: filmObj.studio._id.toString(),
                name: filmObj.studio.name
              }
            }
          );
        }));
      });
  });
});
