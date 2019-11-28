'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AccountSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum:['Savings', 'Checkings'],
    required: true,
  },
  balance: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Accounts', AccountSchema);
