'use strict';
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');

//middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//db setup
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/zooty_development');

//build directory
app.use(express.static(__dirname + '/build'));

//sends passport for configuration
require('./config/passport')(passport);

//setting up express app
app.use(cookieParser()); //reads cookies for authentication
app.use(bodyParser.json()); //parses incoming info -- can be moved to routes 

//passport requirements
app.use(session({
  secret: 'kiwitime',
  resave: false, 
  saveUninitialized: false
})); 
app.use(passport.initialize());
app.use(passport.session());//allows for persistent login sessions

app.listen((process.env.PORT || 3000), function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});