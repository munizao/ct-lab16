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
  let studios;
  let actors;
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ films, studios, actors } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a film', () => {
    const film = {
      title: 'Real Genius',
      studio: studios[0]._id,
      released: 1985
    };

    return request(app)
      .post('/api/v1/films/')
      .send(film)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            title: film.title,
            studio: film.studio.toString(),
            released: film.released,
            cast: [],
            __v: 0
          });
      });
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

  it('gets a film by id', () => {
    return request(app)
      .get(`/api/v1/films/${films[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: films[0]._id.toString(),
          title: films[0].title,
          released: films[0].released,
          studio: {
            _id: studios[0]._id.toString(),
            name: studios[0].name
          },
          cast: [{
            _id: films[0].cast[0]._id.toString(), 
            role: films[0].cast[0].role,
            actor: {
              _id: actors[0]._id.toString(),
              name: actors[0].name
            } 
          }]
        });
      });
  });

  it('deletes a film by id', () => {
    return request(app)
      .delete(`/api/v1/films/${films[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: films[0]._id.toString(),
          title: films[0].title,
          cast: JSON.parse(JSON.stringify(films[0].cast)),
          released: films[0].released,
          studio: films[0].studio.toString()
        });
      });
  });

});
