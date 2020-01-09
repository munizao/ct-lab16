require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const { getReviews, getFilm, getReviewer } = require('../lib/test-setup/setup');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');


describe('reviewer routes', () => {
  it('creates a review', async() => {
    const film = await getFilm();
    const reviewer = await getReviewer();

    const reviewObj = {
      rating: 2,
      review: 'It was better than CATS.',
      reviewer: reviewer,
      film: film
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
            reviewer: reviewer._id,
            film: film._id
          });
      });
  });

  it('gets all reviews', async() => {
    const reviews = await getReviews();
    return request(app)
      .get('/api/v1/reviews/')
      .then(res => {
        return Promise.all(reviews.map(async(review) => {
          const filmDoc = await Film.findById(review.film);
          expect(res.body).toContainEqual(
            {
              _id: review._id,
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
    const reviewer = await getReviewer();
    const film = await getFilm();
    for(let i = 0; i < 150; i++) {
      await Review.create({
        rating: i % 5 + 1,
        review: 'It was better than CATS.',
        reviewer: reviewer,
        film: film
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
