const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
}, {
  id: false,
  toObj: {
    versionKey: false,
    virtuals: true
  },
  toJSON: {
    versionKey: false,
    virtuals: true
  }
});

schema.virtual('films', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'studio'
});

const model = mongoose.model('Studio', schema);
module.exports = model;
