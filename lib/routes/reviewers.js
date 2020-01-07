const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', (req, res) => {
    Reviewer
      .create(req.body)
      .then(entry => res.send(entry));
  })
  .get('/', (req, res) => {
    Reviewer
      .find()
      .lean()
      .select({__v: false })
      .populate('reviews')
      .then((entries) => res.send(entries));
  })