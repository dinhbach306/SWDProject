const mongoose = require('mongoose');
const validator = require('validator');

const componentSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'Component',
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cageComponentSchema = new mongoose.Schema(
  {
    cage: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cage',
      },
    ],
    components: [componentSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const CageComponent = mongoose.model('CageComponent', cageComponentSchema);
module.exports = CageComponent;
