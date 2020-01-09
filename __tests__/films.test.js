require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');


const { getFilm, getFilms, getStudio, } = require('../lib/test-setup/setup');


describe('film routes', () => {
  it('creates a film', async() => {
    const studio = await getStudio();
    const film = {
      title: 'Real Genius',
      studio: studio._id,
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
            studio: film.studio,
            released: film.released,
            cast: [],
          });
      });
  });

  it('gets all films', async() => {
    const films = await getFilms();
    return request(app)
      .get('/api/v1/films/')
      .then(async res => {
        await Promise.all(films.map(async(film) => {
          // filmDoc = await Film.hydrate(film).populate('studio', 'name').execPopulate();
          const studio = await Studio.findById(film.studio);
          return expect(res.body).toContainEqual(
            {
              _id: film._id,
              title: film.title,
              released: film.released,
              studio: {
                _id: studio._id.toString(),
                name: studio.name
              }
            }
          );
        }));
      });
  });

  it('gets a film by id', async() => {
    const film = await getFilm();
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(async res => {
        const studio = await Studio.findById(film.studio); 
        const cast = await Promise.all(film.cast.map(async castMember => {
          const actor = await Actor.findById(castMember.actor);
          return {
            _id: castMember._id,
            role: castMember.role,
            actor: { _id: actor._id, name: actor.name }
          };
        }));
        expect(res.body).toEqual({
          _id: film._id,
          title: film.title,
          released: film.released,
          studio: {
            _id: studio._id.toString(),
            name: studio.name
          },
          cast: JSON.parse(JSON.stringify(cast))
        });
      });
  });

  it('deletes a film by id', async() => {
    const film = await getFilm();

    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: film._id,
          title: film.title,
          cast: JSON.parse(JSON.stringify(film.cast)),
          released: film.released,
          studio: film.studio.toString()
        });
      });
  });

});
