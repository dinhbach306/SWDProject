const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide your title'],
    maxLength: 100,
  },
  effectiveDate: {
    type: String,
    required: [true, 'Please provide your effective date'],
  },
  expirationDate: {
    type: String,
    required: [true, 'Please provide your experiment date'],
  },
  conditionPoint: {
    type: Number,
  },
  status: {
    type: Number,
    default: 0,
    required: [true, 'Please provide your status'],
  },
});
const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
