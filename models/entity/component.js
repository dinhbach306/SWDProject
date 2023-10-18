const mongoose = require('mongoose');
const validator = require('validator');

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, 'Please provide your price'],
    },
    imagePath: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;
