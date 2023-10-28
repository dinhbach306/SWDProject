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
    component: [componentSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cageComponentSchema.pre(/^find/, function (next) {
  this.find({ delFlg: { $ne: true } });
  next();
});
const CageComponent = mongoose.model('CageComponent', cageComponentSchema);
module.exports = CageComponent;
