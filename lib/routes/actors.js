const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');


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
  })
  .delete('/:id', async(req, res, next) => {
    const actorFilms = await Film.find().where('cast.actor').equals(req.params.id);
    console.log(actorFilms);
    if(actorFilms.length === 0) {
      Actor
        .findById(req.params.id)
        .select({ __v: false })
        .then((entry) => {
          entry.remove();
          res.send(entry);
        });
    }
    else {
      const err = new Error('Cannot delete actor while there are films including it.');
      err.status = 403;
      return next(err);
    }
  });
