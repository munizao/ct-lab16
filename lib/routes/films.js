const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res) => {
    Film
      .create(req.body)
      .then(entry => res.send(entry));
  })
  .get('/', (req, res) => {
    Film
      .find()
      .lean()
      .select({ cast: false, __v: false })
      .populate('studio', 'name')
      .then((entries) => res.send(entries));
  })
  .get('/:id', (req, res) => {
    Film
      .findById(req.params.id)
      .lean()
      .populate('studio', 'name')
      .populate('cast.actor', 'name')
      .select({ __v: false })
      .then(entry => res.send(entry));
  })
  .delete('/:id', (req, res) => {
    Film
      .findById(req.params.id)
      .select({ __v: false })
      .then((entries) => res.send(entries));
  });
