const mongoose = require('mongoose');
const validator = require('validator');

const cageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      maxLength: 50,
    },
    length: {
      type: Number,
      required: [true, 'Please provide your length'],
    },
    width: {
      type: Number,
      required: [true, 'Please provide your width'],
    },
    height: {
      type: Number,
      required: [true, 'Please provide your height'],
    },
    inStock: {
      type: Number,
      required: [true, 'Please provide your inStock'],
    },
    description: {
      type: String,
      maxLength: 255,
    },
    createDate: {
      type: String,
      required: [true, 'Please provide your create date'],
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
    },
    price: {
      type: Number,
      maxLength: 9,
      required: [true, 'Please provide your price'],
    },
    status: {
      type: Number,
      default: 1,
    },
    rating: Number,
    imagePath: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Cage = mongoose.model('Cage', cageSchema);
module.exports = Cage;
