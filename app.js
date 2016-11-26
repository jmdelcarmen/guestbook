'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
/////////////////AuthO////////////////////
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
////////////Multer file uploader//////////////
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});

require('dotenv').config();

module.exports.env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};


// This will configure Passport to use Auth0
const strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL
  }, (accessToken, refreshToken, extraParams, profile, done) => {
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

////////////////Mongo DB///////////////////
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/guestbook');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/////////////////FILE UPLOAD///////////////////////
app.use(multer({dest: 'public/uploads'}).single('profileImage'));
/////////////////MIDDLEWARE///////////////////////
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/////////////////////APIS//////////////////////
app.use('/', require('./routes/index'));
app.use('/guestbook', require('./routes/guestbook'));

app.get('*', (req, res, next) => {
  module.locals.user = req.user || null;
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
console.log('Awesomeness is happening at port 3000...');
