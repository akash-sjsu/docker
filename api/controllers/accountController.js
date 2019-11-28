'use strict';


var mongoose = require('mongoose'),
  User = mongoose.model('Users');
  Account = mongoose.model('Accounts');


exports.list_all_accounts = function(req, res) {
  Account.find({}, function(err, account) {
    if (err)
      res.send(err);
    res.json(account);
  });
};




exports.create_a_account = function(req, res) {
  var response;
  var curr_user = req.session.user;
  console.log(curr_user);
  if(curr_user == null){
    res.send("Please login");
  } else {
    req.body.owner = curr_user._id;
    var new_account = new Account(req.body);
    console.log(req.body);
    new_account.save(function(err, account) {
      if (err){
        res.send(err);
      }else{
        User.findOne({_id: curr_user._id},  function(err, user) {
            if (err)
              response = "Shouldn't get this error";
            user.accounts.push(new_account);
            user.save(function(err){
            })
            console.log(user);
        });
        res.json(account);
      }
    });

  }
};


exports.read_a_account = function(req, res) {
  console.log(req.params.accountId);
  Account.findById(req.params.accountId, function(err, account) {
    if (err)
      res.send(err);
    res.json(account);
  });
};


exports.update_a_account = function(req, res) {
  account.findOneAndUpdate({_id: req.params.accountId}, req.body, {new: true}, function(err, account) {
    if (err)
      res.send(err);
    res.json(account);
  });
};


exports.delete_a_account = function(req, res) {
  Account.remove({
    _id: req.params.accountId
  }, function(err, account) {
    if (err)
      res.send(err);
    res.json({ message: 'account successfully deleted' });
  });
};

// exports.transfer = function(req, res) {
//   account.findOneAndUpdate({_id: req.params.accountId}, req.body, {new: true}, function(err, account) {
//     if (err)
//       res.send(err);
//     res.json(account);
//   });
// };
