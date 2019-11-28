'use strict';
module.exports = function(app) {
  var account = require('../controllers/accountController');
  var transactions = require('../controllers/transactionController');
  var user = require('../controllers/userController');


  // account Routes
  app.route('/accounts')
    .get(account.list_all_accounts)
    .post(account.create_a_account);


  app.route('/accounts/:accountId')
    .get(account.read_a_account)
    .put(account.update_a_account)
    .delete(account.delete_a_account);




    app.route('/transactions')
      .get(transactions.list_all_transactions);
      //.post(transactions.create_a_task);



    app.route('/transactions/search').get(transactions.search_transactions);

    app.route('/transactions/add').post(transactions.create_a_transaction);

    app.route('/setupPayment').post(transactions.create_a_payment);



    app.route('/transactions/:transactionId')
      .get(transactions.read_a_transaction);
     // .put(todoList.update_a_task)
     // .delete(todoList.delete_a_task);

    app.route('/transfer')
      .post(transactions.transfer);


    app.route('/users')
      .get(user.list_all_users)
      // .delete(user.delete_all_users);

    app.route('/signup')
      .post(user.create_a_user);

    app.route('/login')
      .post(user.login);

};
