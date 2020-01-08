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
      .lean()
      .select({ __v: false })
      .then((entries) => res.send(entries));
  });
