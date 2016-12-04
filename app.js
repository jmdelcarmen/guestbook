'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
/////////////////Auth////////////////////
const session = require('express-session');
const passport = require('passport');
const authConfig = require('./routes/auth_config');
////////////Multer file uploader//////////////
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});
require('dotenv').config();

//routes
const index = require('./routes/index');
const guestbook = require('./routes/guestbook');

////////////////Mongo DB///////////////////
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI  || 'mongodb://localhost/guestbook');
const app = express();
const PORT = process.env.PORT || 3000;

//Flash messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(multer({dest: 'public/uploads'}).single('profileImage')); //file upload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
//auth
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//auth strategy
passport.use(authConfig.auth0Strategy);
authConfig.auth0();
passport.use(authConfig.localStrategy);
authConfig.localAuth();

//APIS//
//index
app.get('/', index.landingPage);
app.get('/local_signup', index.showLocalSignup);
app.post('/local_signup', index.signupUser);
app.get('/local_login', index.showLocalLogin);
app.post('/local_login', passport.authenticate('local', {failureRedirect: '/local_login'}), index.loginUser);
app.get('/auth0_login', index.showAuth0Lock);
app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/' }), index.loginUser);
//guestbook
app.use(authConfig.ensureAuthenticated); //auth user
app.get('/guestbook', guestbook.showGuestbook);
app.post('/guestbook/note/add', guestbook.addNote);
app.get('/guestbook/note/remove/:id', guestbook.removeNote);
app.get('/guestbook/note/:id', guestbook.showGuestNote);
app.get('/guestbook/logout', guestbook.logout);
app.get('/guestbook/addnote', guestbook.showAddNote);


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




app.listen(PORT, () => {
  console.log('Awesomeness is happening at port 3000...');
})
