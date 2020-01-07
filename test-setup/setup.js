const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');


const testSetup = async() => {
  let studios = await Studio.create([
    {
      name: 'Dreamworks',
      address: {
        city: 'Hollywood',
        state: 'California',
        country: 'USA'
      }
    },
    {
      name: 'Laika',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    }
  ]);
  let actors = await Actor.create([
    {
      name: 'Yahoo Serious',
      date: new Date(1953, 6, 27),
      pob: 'Cardiff, NSW, Australia'
    },
    {
      name: 'Meg Ryan',
      date: new Date(1961, 10, 19),
      pob: 'Fairfield, CT, USA'
    }
  ]);

  let films = await Film.create([
    {
      title: 'Young Einstein',
      studio: studios[0]._id,
      released: 1988,
      cast: [{
        role: 'Einstein',
        actor: actors[0]._id
      }]
    },
    {
      title: 'When Harry Met Sally',
      studio: studios[1]._id,
      released: 1989,
      cast: [{
        role: 'Sally',
        actor: actors[1]._id
      }]
    }
  ]);

  return { studios, actors, films };
};

module.exports = { testSetup };
