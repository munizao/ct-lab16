const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', (req, res, next) => {
    Reviewer
      .create(req.body)
      .then(entry => res.send(entry))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .lean()
      .select({ __v: false })
      .then((entries) => res.send(entries))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .lean()
      .select({ __v: false })
      .populate({ path: 'reviews', 
        select: { rating: true, _id: true, review: true, film: true }, 
        populate: { path: 'film', select: { _id: true, title: true } } })
      .then((entry) => {
        return res.send(entry);
      })
      .catch(next);

  })
  .patch('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((entry) => {
        return res.send(entry);
      })
      .catch(next);
  });

