/* eslint-disable semi */
const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res) => {
    Studio
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries));
  });
