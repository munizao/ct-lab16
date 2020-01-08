const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res) => {
    Studio
      .create(req.body)
      .then(entry => res.send(entry));
  })
  .get('/', (req, res, next) => {
    Studio
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Studio
      .findById(req.params.id)
      .lean()
      .populate({ path: 'films', select: 'title -studio' })
      .select({ __v: false })
      .then(entry => res.send(entry))
      .catch(next);
  })
  .delete('/:id', async(req, res, next) => {
    const studioFilms = await Film.find({ studio: req.params.id });
    if(studioFilms.length === 0) {
      Studio
        .findById(req.params.id)
        .select({ __v: false })
        .then((entry) => {
          entry.remove();
          res.send(entry);
        })
        .catch(next);
    }
    else {
      const err = new Error('Cannot delete studio while there are films by it.');
      err.status = 403;
      return next(err);
    }
  });
