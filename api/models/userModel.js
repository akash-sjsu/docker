'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isEmail = require('validator/lib/isEmail');

var UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: [ isEmail, 'invalid email' ],
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  accounts: [{type: Schema.ObjectId, ref: 'Accounts'}]
});

module.exports = mongoose.model('Users', UserSchema);
