require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const Film = require('../lib/models/Film');
const { getReviewer, getReviewers, getReviews } = require('../lib/test-setup/setup');

describe('reviewer routes', () => {

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

  it('gets all reviewers', async() => {
    const reviewers = await getReviewers();

    return request(app)
      .get('/api/v1/reviewers/')
      .then(res => {
        reviewers.forEach((reviewer) => {
          expect(res.body).toContainEqual(
            {
              _id: reviewer._id,
              name: reviewer.name,
              company: reviewer.company
            });
        });
      });
  });

  it('gets a reviewer by id', async() => {
    const reviewer = await getReviewer();
    let reviews = await getReviews();
    reviews = reviews.filter(review => review.reviewer === reviewer._id);
    reviews = await Promise.all(reviews.map(async review => { 
      const film = await Film.findById(review.film).select('title');
      review.film = film;
      return JSON.parse(JSON.stringify(review));
    }));
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: reviewer._id,
            name: reviewer.name,
            company: reviewer.company,
            reviews: reviews
          });
      });
  });

  it('updates a reviewer by id', async() => {
    const reviewer = await getReviewer();
    return request(app)
      .patch(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'Richard Roeper' })
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: reviewer._id,
            name: 'Richard Roeper',
            company: reviewer.company,
          });
      });
  });
});
