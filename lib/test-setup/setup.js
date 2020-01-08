require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');

const modelNames = ['Studio', 'Actor', 'Film', 'Reviewer', 'Review']
const models = modelNames.map(name => require(`../models/${name}`));
const seed = require('./seed');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const getters = {};
models.map(Model => {
  const modelName = Model.modelName;
  getters[`get${modelName}`] = () => Model.findOne().then(prepare),
  getters[`get${modelName}s`] = () => Model.find().then(prepare)
});

module.exports = getters;





