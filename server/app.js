var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meetupRouter = require('./routes/meetup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // CORS
// const corsOptions = {
//   origin: 'https://cs633-study-together.onrender.com',
//   methods: '*',
//   allowedHeaders: 'Content-Type,Authorization',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/meetup', meetupRouter);

// connect to database
const mongodb_uri = process.env.DATABASE_URL;
mongoose.connect(mongodb_uri)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongodb_uri}`);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

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
