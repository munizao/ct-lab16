const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    Film
      .create(req.body)
      .then(entry => res.send(entry))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Film
      .find()
      .lean()
      .select({ cast: false, __v: false })
      .populate('studio', 'name')
      .then((entries) => res.send(entries))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .lean()
      .populate('studio', 'name')
      .populate('cast.actor', 'name')
      .select({ __v: false })
      .then(entry => res.send(entry))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .select({ __v: false })
      .then((entries) => res.send(entries))
      .catch(next);
  });
