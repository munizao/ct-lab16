const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .get('/', (req, res) => {
    Actor
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries));
  });
