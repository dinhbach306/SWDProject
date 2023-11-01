const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../../utils/appError');

const cageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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

      // required: [true, 'Please provide your inStock'],
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
      min: [0, 'Price must be a positive number']
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
    image: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Image',
      },
    ],
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

cageSchema.pre(/^find/, function (next) {
  const filter = {};
  const querySetting = this.get('querySetting');
  console.log(querySetting);
  // default query not deleted item
  if (querySetting == null) {
    filter.delFlg = false;
  }else if(querySetting == 'deleted'){
    filter.delFlg = true;
  }else if (querySetting == "all"){

  }
  // other means query all item
  // console.log(filter);
  this.find(filter);
  next();
});
const Cage = mongoose.model('Cage', cageSchema);
module.exports = Cage;
