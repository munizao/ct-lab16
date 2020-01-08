require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const { getActors, getFilms } = require('../lib/test-setup/setup');


describe('actor routes', () => {

  it('creates an actor', () => {
    const actor = {
      name: 'Drew Barrymore',
      dob: new Date(1975, 1, 22),
      pob: 'Culver City, California, USA'
    };

    return request(app)
      .post('/api/v1/actors/')
      .send(actor)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            name: actor.name,
            pob: actor.pob,
            dob: actor.dob.toISOString(),
            __v: 0
          });
      });
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

  it('deletes an actor by id', async() => {
    const actorObj = {
      name: 'Drew Barrymore',
      dob: new Date(1975, 1, 22),
      pob: 'Culver City, California, USA'
    };

    const actor = await Actor.create(actorObj);

    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(async(res) => {
        const id = actor._id;
        expect(res.body).toEqual({
          _id: actor._id.toString(),
          name: 'Drew Barrymore',
          dob: actor.dob.toISOString(),
          pob: 'Culver City, California, USA'
        });
        const deletedActor = await Actor.findById(id);
        expect(deletedActor).toBeFalsy();
      });
  });

  it('errors if you delete an actor by id when it is used by a film', () => {
    return request(app)
      .delete(`/api/v1/actors/${actors[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Cannot delete actor while there are films including it.',
          status: 403
        });
      });
  });
});
