'use strict';


var mongoose = require('mongoose'),
  User = mongoose.model('Users');

var sess;

exports.list_all_users = function(req, res) {
  sess = req.session;
  User.find({}, function(err, user) {
    if(sess.user){
      console.log(sess.user);
    }
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.create_a_user = function(req, res) {
  var new_user = new User(req.body);
  // console.log(req.body);
  // console.log(req.body.first_name);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.login = function(req, res){
  sess = req.session;
  User.findOne({'username': req.body.username, 'password': req.body.password}, function(err, user) {
    if(err)
      res.send(err);
    if(user == null){
      res.send("Login failed!");
    }else{
      sess.user = user;
      res.json(user);
    }
  });
};


// exports.read_a_task = function(req, res) {
//   Task.findById(req.params.taskId, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };
//
//
// exports.update_a_task = function(req, res) {
//   Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.delete_all_users = function(req, res) {
//   sess = req.session;
//   Task.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
// };
