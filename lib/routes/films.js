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
  });
