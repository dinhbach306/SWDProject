const mongoose = require('mongoose');
const validator = require('validator');

const cageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      maxLength: 255,
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
      maxLength: 5000,
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
      type: String,
      enum: {
        values: ['Available', 'Pending', 'CUS', 'Reject', 'UnAvailable'],
        message: 'status is either',
      },
    },
    userId: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    imagePath: String,
    delFlg: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Cage = mongoose.model('Cage', cageSchema);
module.exports = Cage;
