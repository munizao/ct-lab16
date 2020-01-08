require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const { getActor, getActors, getFilms } = require('../lib/test-setup/setup');


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

  it('gets all actors', async() => {
    const actors = await getActors();
    return request(app)
      .get('/api/v1/actors/')
      .then(res => {
        actors.forEach((actor) => {
          expect(res.body).toContainEqual(
            {
              _id: actor._id,
              name: actor.name,
            });
        });
      });
  });

  it('gets an actor by id', async() => {
    const actor = await getActor();
    let allFilms = await getFilms();
    const films = allFilms.filter(film => film.cast.map(castMember => castMember.actor).includes(actor._id));
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: actor._id,
            name: actor.name,
            dob: actor.dob,
            pob: actor.pob,
            films: films.map(film => { 
              return {
                _id: film._id,
                title: film.title,
                released: film.released
              };
            })
          });
      });
  });

  it('deletes an actor by id', async() => {
    const actorObj = {
      name: 'Drew Barrymore',
      dob: new Date(1975, 1, 22),
      pob: 'Culver City, California, USA'
    };

    let actor = await Actor.create(actorObj);
    actor = JSON.parse(JSON.stringify(actor));
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(async(res) => {
        const id = actor._id;
        expect(res.body).toEqual({
          _id: actor._id,
          name: actor.name,
          dob: actor.dob,
          pob: actor.pob
        });
        const deletedActor = await Actor.findById(id);
        expect(deletedActor).toBeFalsy();
      });
  });

  it('errors if you delete an actor by id when it is used by a film', async() => {
    const actor = await getActor();
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Cannot delete actor while there are films including it.',
          status: 403
        });
      });
  });
});
