const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res) => {
    Actor
      .create(req.body)
      .then(entry => res.send(entry));
  })
  .get('/', (req, res) => {
    Actor
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries));
  })
  .get('/:id', (req, res) => {
    Actor
      .findById(req.params.id)
      .lean()
      .select({ __v: false })
      .populate({ path: 'films', select: { title: true, _id: true, released: true } })
      .then((entry) => {
        // I don't understand why I have to do this.
        entry.films.map(film => delete film.cast);
        return res.send(entry);
      });
  });
