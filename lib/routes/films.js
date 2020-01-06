const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .get('/', (req, res) => {
    Film
      .find()
      .lean()
      .select({ cast: false, __v: false })
      .populate('studio', 'name')
      .then((entries) => res.send(entries));
  });
