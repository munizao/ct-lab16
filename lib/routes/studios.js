const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res) => {
    Studio
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries));
  })
  .get('/:id', (req, res) => {
    Studio
      .findById(req.params.id)
      .lean()
      .populate({ path: 'films', select: 'title -studio' })
      .select({ __v: false })
      .then(entry => res.send(entry));
  });
