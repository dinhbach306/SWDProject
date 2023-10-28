const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    imagePath: Array,
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

imageSchema.pre(/^find/, function (next) {
  this.find({ delFlg: { $ne: true } });
  next();
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
