const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
}, {
  id: false,
  toObject: { 
    versionKey: false,
    virtuals: true 
  },
  toJSON: { 
    versionKey: false,
    virtuals: true 
  }
});

schema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewer'
});

const model = mongoose.model('Reviewer', schema);
module.exports = model;
