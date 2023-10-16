const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    maxLength: 50,
    minLength: 2,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    maxLength: 50,
    minLength: 2,
  },
  birthDay: {
    type: String,
    required: [true, 'Please provide your birthday'],
  },
  point: {
    type: Number,
    default: 0,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
});
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
