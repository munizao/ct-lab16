const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res) => {
    Review
      .create(req.body)
      .then(entry => res.send(entry));
  })
  .get('/', (req, res) => {
    Review
      .find()
      .sort({ rating: 'desc' })
      .limit(100)
      .lean()
      .populate({ path: 'film', select: { title: true } })
      .select({ __v: false, reviewer: false })
      .then((entries) => res.send(entries));
  });
