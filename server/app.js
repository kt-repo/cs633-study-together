var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const { mongodb_uri } = require('./config/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meetupRouter = require('./routes/meetup');

var app = express();

// Serve Angular static files
app.use(express.static(path.join(__dirname, '../client/dist/meetup-app-angular')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/meetup', meetupRouter);

// connect to database
run();
async function run() {
  try {
    mongoose.connect(mongodb_uri);
    console.log('Connected to database...');
  } catch(err) {
    console.log(err.message);
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
