const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res) => {
    Studio
      .create(req.body)
      .then(entry => res.send(entry));
  })
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
  })
  .delete('/:id', async(req, res, next) => {
    const studioFilms = await Film.find({ studio: req.params.id });
    console.log(studioFilms);
    if(studioFilms.length === 0) {
      Studio
        .findById(req.params.id)
        .select({ __v: false })
        .then((entry) => {
          entry.remove();
          res.send(entry);
        });
    }
    else {
      const err = new Error('Cannot delete studio while there are films by it.');
      err.status = 403;
      return next(err);
    }

  });
