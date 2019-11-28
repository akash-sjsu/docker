var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'), //created model loading here
  Trans = require('./api/models/transactionModel')
  Account = require('./api/models/accountModel')
  bodyParser = require('body-parser');
  cors = require('cors');
  session = require('express-session');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo:27017/bankdb');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
   app.use(bodyParser.json());
   // parse various different custom JSON types as JSON
   app.use(bodyParser.json({ type: 'application/*+json' }));
   // parse some custom thing into a Buffer
   app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
   // parse an HTML body into a string
   app.use(bodyParser.text({ type: 'text/html' }));
   // parse an text body into a string
   app.use(bodyParser.text({ type: 'text/plain' }));
   // create application/x-www-form-urlencoded parser
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(session({secret: 'ssshhhhh'}));
app.use(cors());

var routes = require('./api/routes/bankRoutes'); //importing route
routes(app); //register the route


app.listen(port);



console.log('todo list RESTful API server started on: ' + port);
