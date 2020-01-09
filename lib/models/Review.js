const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  review: {
    type: String,
    maxlength: 140,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
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

const model = mongoose.model('Review', schema);
module.exports = model;
