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

componentSchema.pre(/^find/, function (next) {
  this.find({ delFlg: { $ne: true } });
  next();
});

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;
