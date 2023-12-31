const mongoose = require('mongoose');
const validator = require('validator');

const voucherSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide your title'],
      maxLength: 100,
    },
    effectiveDate: {
      type: String,
      required: [true, 'Please provide your effective date'],
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
    },
    expirationDate: {
      type: String,
      required: [true, 'Please provide your experiment date'],
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
    },
    conditionPoint: {
      type: Number,
      required: [true, 'Please provide your condition point'],
    },
    status: {
      type: String,
    },
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

voucherSchema.pre(/^find/, function (next) {
  this.find({ delFlg: { $ne: true } });
  next();
});

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
