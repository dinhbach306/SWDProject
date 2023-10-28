const mongoose = require('mongoose');
const validator = require('validator');

const cageComponentSchema = new mongoose.Schema(
  {
    cage: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cage',
      },
    ],
    component: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Component',

        quantity: {
          type: Number,
          default: 1,
          required: [true, 'Please provide your quantity'],
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const CageComponent = mongoose.model('CageComponent', cageComponentSchema);
module.exports = CageComponent;
