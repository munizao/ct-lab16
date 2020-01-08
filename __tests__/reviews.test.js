require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { testSetup } = require('../test-setup/setup');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');


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

  it('gets all reviews', () => {
    return request(app)
      .get('/api/v1/reviews/')
      .then(res => {
        return Promise.all(reviews.map(async(review) => {
          const filmDoc = await Film.findById(review.film);
          expect(res.body).toContainEqual(
            {
              _id: review._id.toString(),
              rating: review.rating,
              review: review.review,
              film: {
                _id: filmDoc._id.toString(),
                title: filmDoc.title
              }
            });
        })); 
      });
  });

  it('gets only the highest 100 reviews', async() => {
    for(let i = 0; i < 150; i++) {
      await Review.create({
        rating: i % 5 + 1,
        review: 'It was better than CATS.',
        reviewer: reviewers[0],
        film: films[0]
      });
    }

    return request(app)
      .get('/api/v1/reviews/')
      .then(res => {
        expect(res.body.length).toEqual(100);
        const justRatings = res.body.map((review) => review.rating);
        expect(justRatings).not.toContainEqual(1);
      });
  });
});
