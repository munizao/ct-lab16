require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  let reviewers;
  let reviews;
  let films;

  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    ({ reviewers, reviews, films } = await testSetup());
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a reviewer', () => {
    const reviewerObj = {
      name: 'Gene Siskel',
      company: 'Chicago Tribune'
    };

    return request(app)
      .post('/api/v1/reviewers/')
      .send(reviewerObj)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            name: 'Gene Siskel',
            company: 'Chicago Tribune',
          });
      });
  });

  it('gets all reviewers', () => {
    return request(app)
      .get('/api/v1/reviewers/')
      .then(res => {
        reviewers.forEach((reviewer) => {
          expect(res.body).toContainEqual(
            {
              _id: reviewer._id.toString(),
              name: reviewer.name,
              company: reviewer.company
            });
        });
      });
  });

  it('gets a reviewer by id', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewers[0]._id}`)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: reviewers[0]._id.toString(),
            name: reviewers[0].name,
            company: reviewers[0].company,
            reviews: [
              {
                _id: reviews[0]._id.toString(),
                rating: reviews[0].rating,
                reviewer: reviews[0].reviewer.toString(),
                review: reviews[0].review,
                film: {
                  _id: films[0]._id.toString(),
                  title: films[0].title
                }
              }
            ]
          });
      });
  });

  it('updates a reviewer by id', () => {
    return request(app)
      .patch(`/api/v1/reviewers/${reviewers[0]._id}`)
      .send({ name: 'Richard Roeper'})
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: reviewers[0]._id.toString(),
            name: 'Richard Roeper',
            company: reviewers[0].company,
          });
      });
  });
});
