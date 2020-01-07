require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Actor = require('../lib/models/Actor');
const { testSetup } = require('../test-setup/setup');


describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });
  let actors;
  let films;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ actors, films } = await testSetup());
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


  it('gets an actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actors[0]._id}`)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: actors[0]._id.toString(),
            name: actors[0].name,
            dob: actors[0].dob.toISOString(),
            pob: actors[0].pob,
            films: [
              {
                _id: films[0]._id.toString(),
                title: films[0].title,
                released: films[0].released
              }
            ]
          });
      });
  });
});
