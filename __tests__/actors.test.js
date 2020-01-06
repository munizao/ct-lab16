require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });
  let actors;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    actors = await Actor.create([
      {
        name: 'Yahoo Serious',
        date: new Date(1953, 6, 27),
        pob: 'Cardiff, NSW, Australia'
      },
      {
        name: 'Meg Ryan',
        date: new Date(1961, 10, 19),
        pob: 'Fairfield, CT, USA'
      }
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('gets all actors', () => {
    return request(app)
      .get('/api/v1/actors/')
      .then(res => {
        actors.forEach((actor) => {
          expect(res.body).toContainEqual(
            {
              _id: actor._id.toString(),
              name: actor.name,
            });
        });
      });
  });
});
