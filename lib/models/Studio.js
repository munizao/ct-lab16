const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
  address: {
    city: String,
    state: String,
    country: String
  }
});

const model = mongoose.model('Studio', schema);
module.exports = model;
