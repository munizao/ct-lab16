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

  it('creates a review', () => {
    const reviewObj = {
      rating: 2,
      review: 'It was better than CATS.',
      reviewer: reviewers[0],
      film: films[0]
    };

    return request(app)
      .post('/api/v1/reviews/')
      .send(reviewObj)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            rating: 2,
            review: 'It was better than CATS.',
            reviewer: reviewers[0]._id.toString(),
            film: films[0]._id.toString()
          });
      });
  });
})