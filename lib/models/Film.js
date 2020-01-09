const mongoose = require('mongoose');

const castMemberSchema = new mongoose.Schema({
  role: String,
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor',
    required: true
  }
});

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1000,
    max: 9999
  },
  cast: [castMemberSchema]
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

const model = mongoose.model('Film', filmSchema);
module.exports = model;
