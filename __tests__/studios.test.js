require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const { getStudio, getStudios, getFilms } = require('../lib/test-setup/setup');


describe('studio routes', () => {
  it('creates a studio', () => {
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
          });
      });
  });

  it('gets all studios', async() => {
    const studios = await getStudios();
    return request(app)
      .get('/api/v1/studios/')
      .then(res => {
        studios.forEach((studio) => {
          expect(res.body).toContainEqual(
            {
              _id: studio._id,
              name: studio.name,
            });
        });
      });
  });

  it('gets a studio by id', async() => {
    const studio = await getStudio();
    let allFilms = await getFilms();
    const films = allFilms.filter(film => film.studio === studio._id);
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id,
          name: studio.name,
          address: {
            city: studio.address.city,
            state: studio.address.state,
            country: studio.address.country
          },
          films: films.map(film => {
            return {
              _id: film._id,
              title: film.title
            }
          })
        });
      });
  });

  it('deletes a studio by id', async() => {
    const studioObj = {
      name: 'Pixar',
      address: {
        city: 'Hollywood',
        state: 'California',
        country: 'USA'
      }
    };

    const studio = await Studio.create(studioObj);

    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(async(res) => {
        const id = studio._id;
        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name: 'Pixar',
          address: {
            city: 'Hollywood',
            state: 'California',
            country: 'USA'
          },
        });
        const deletedStudio = await Studio.findById(id);
        expect(deletedStudio).toBeFalsy();
      });
  });

  it('errors if you delete a studio by id when it is used by a film', async() => {
    const studio = await getStudio();
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Cannot delete studio while there are films by it.',
          status: 403
        });
      });
  });
});
