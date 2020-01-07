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
  beforeEach(async() => {
    mongoose.connection.dropDatabase();
    ({ reviewers } = await testSetup());
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
          });
      });
  });
});
