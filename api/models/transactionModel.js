'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({
  transaction_id: Number,
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accounts',
    required: true
  },
  recipient_id: Number,
  created_date: {
    type: Date,
    default: Date.now
  },
  type: {
      type: String,
      enum: ['Deposit', 'Withdraw'],
    },
    frequency:{
      type: [{
        type: String,
        enum: ['once','daily', 'monthly', 'annually']
      }],

    },
  amount: {
    type: Number,
    required: true
  },

  description: String
});

module.exports = mongoose.model('Transactions', TransactionSchema);
