const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    Review
      .create(req.body)
      .then(entry => res.send(entry))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Review
      .find()
      .sort({ rating: 'desc' })
      .limit(100)
      .lean()
      .populate({ path: 'film', select: { title: true } })
      .select({ __v: false, reviewer: false })
      .then((entries) => res.send(entries))
      .catch(next);
  });
