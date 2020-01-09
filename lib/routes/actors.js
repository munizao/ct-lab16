const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');


module.exports = Router()
  .post('/', (req, res, next) => {
    Actor
      .create(req.body)
      .then(entry => res.send(entry))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Actor
      .find()
      .lean()
      .select({ name: true })
      .then((entries) => res.send(entries))
      .catch(next);

  })
  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .lean()
      .select({ __v: false })
      .populate({ path: 'films', select: { title: true, _id: true, released: true } })
      .then((entry) => {
        // I don't understand why I have to do this.
        entry.films.map(film => delete film.cast);
        return res.send(entry);
      })
      .catch(next);
  })
  .delete('/:id', async(req, res, next) => {
    const actorFilms = await Film.find().where('cast.actor').equals(req.params.id);
    if(actorFilms.length === 0) {
      Actor
        .findById(req.params.id)
        .select({ __v: false })
        .then((entry) => {
          entry.remove();
          res.send(entry);
        })
        .catch(next);
    }
    else {
      const err = new Error('Cannot delete actor while there are films including it.');
      err.status = 403;
      return next(err);
    }
  });
