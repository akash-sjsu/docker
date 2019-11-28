'use strict';


var mongoose = require('mongoose'),
  Transaction = mongoose.model('Transactions');
  Account = mongoose.model('Accounts');

  exports.list_all_transactions = function(req, res) {
    //lists all transactions within the last 18 months
    //547 days (about 18 months) * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    Transaction.find({"created_date": {"$gte": new Date()- (547*24*60*60*1000), "$lt": Date.now()}}, function(err, transaction) {
      if (err)
        res.send(err);
      res.json(transaction);
    });
  };




exports.create_a_transaction = function(req, res) {
  if(req.session.user.admin == false){
  res.send("Not Admin");
  }
  else{
    var response;
    var new_transaction = new Transaction(req.body);
    console.log(req.body);
    new_transaction.save(function(err, transaction) {
      if (err){
        response = "Create transaction failed; check values and try again";
        // res.write("Create transaction failed; check values and try again");
      }
      Account.findOne({_id: req.body.account}, function(err, account){
        if (err){
          response = response + "Find account failed";
        } else {
          if(req.body.type == "Deposit"){
            account.balance = account.balance + Number(req.body.amount);
            account.markModified("balance");
            account.save(function(err){
            });
            res.json(transaction);
          } else if(req.body.type == "Withdraw"){
            if(account.balance < Number(req.body.amount)){
              response = "Not enough balance to make that withdrawal from this account";
              res.send(response);
            } else{
              account.balance = account.balance - Number(req.body.amount);
              account.save(function(err){
              });
              res.json(transaction);
            }
          }
          console.log(account);
        }
        });
      });
    }
  };

exports.create_a_payment = function(req, res) {
  var frequency = req.body.frequency;
  var curr_user = req.session.user;
  if(frequency != "once" && frequency != "daily" && frequency != "monthly" && frequency != "annually"){
    res.send("Please enter valid frequency ['once','daily', 'monthly', 'annually']")
  } else if(curr_user == null){
    res.send("Please login");
  } else {
    var response;
    var new_transaction = new Transaction(req.body);
    new_transaction.save(function(err, transaction) {
      if (err){
        res.send("Setup payment failed; check values and try again");
      }
      Account.findOne({_id: req.body.account}, function(err, account){
        if (err){
          res.send("Find account failed");
        } else if(curr_user._id != account.owner){
          res.send("Account access denied; this is not your account");
        } else if(account.balance < req.body.amount){
          res.send("Not enough funds to set-up this payment");
        }else{
          account.balance = account.balance - Number(req.body.amount);
          account.save(function(err){
          });
          console.log(transaction);
          res.json(transaction);
        }
      });
    });
  }
};

function transferTransaction(transactionIn){
  var new_transaction = new Transaction(transactionIn);
  new_transaction.save(function(err, transaction) {
    if (err){
      console.log(err);
      // res.write("Create transaction failed; check values and try again");
    }
    Account.findOne({_id: transactionIn.account}, function(err, account){
      if (err){
        console.log(err);
      } else {
        if(transactionIn.type == "Deposit"){
          account.balance = account.balance + Number(transactionIn.amount);
          account.markModified("balance");
          account.save(function(err){
          });
          // res.json(transaction);
        } else if(transactionIn.type == "Withdraw"){
            account.balance = account.balance - Number(transactionIn.amount);
            account.save(function(err){
            });
        }
        console.log("After: \n")
        console.log(account + "\n");
      }
    });
  });
}

exports.transfer = function(req, res){
  var frequency = req.body.frequency;
  var curr_user = req.session.user;
  if(frequency != "once" && frequency != "daily" && frequency != "monthly" && frequency != "annually"){
    res.send("Please enter valid frequency ['once','daily', 'monthly', 'annually']")
  } else if(curr_user == null){
    res.send("Please login");
  } else {
    var response;
    Account.findOne({accountNumber: req.body.from}, function(err,fromAcct){
      if(err){
        res.send("Not a valid from account");
      } else if(curr_user._id != fromAcct.owner){
        res.send("Account access denied; this is not your account to send from");
      } else if(fromAcct.balance < req.body.amount){
        res.send("Not enough funds to make this transaction");
      }else{
        Account.findOne({accountNumber: req.body.to}, function(err, toAcct){
          if(err){
            res.send("not a valid recipient account")
          } else {
            response = "Transfer frequency: " + frequency + "\n\n"
            response = response + "BEFORE: \n\nFrom: \n" + fromAcct + "\n\nTo: \n" + toAcct;
            var fromTrans = {"account": fromAcct, "type": 'Withdraw', "frequency": frequency, "amount": req.body.amount};
            // console.log("****fromtrans*****");
            // console.log(fromTrans);
            var toTrans= {"account": toAcct, "type": 'Deposit', "frequency": frequency, "amount": req.body.amount};
            // console.log("****totrans*****");
            // console.log(toTrans);
            transferTransaction(fromTrans);
            transferTransaction(toTrans);
            res.send(response);
          }
        })
      }
    })
  }
};


exports.search_transactions = function(req, res) {
  Transaction.find({'description' : { '$regex' : req.body.description, '$options' : 'i' }}, function(err, transaction) {
    if (err)
      res.send(err);
    res.json(transaction);
  });
};

exports.read_a_transaction = function(req, res) {
  Transaction.findById(req.params.transactionId, function(err, transaction) {
    if (err)
      res.send(err);
    res.json(transaction);
  });
};


// exports.delete_trans = function(req, res) {
//   Trans.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
// };


// exports.edit_trans = function(req, res) {
//   Trans.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, Tran) {
//     if (err)
//       res.send(err);
//     res.json(Tran);
//   });
// };
