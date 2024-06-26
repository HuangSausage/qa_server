var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


var webRouter = require('./routes/web');

var app = express();
// 解決跨域
app.use(cors({
    // origin:['https://df70-165-84-247-65.ngrok-free.app'],
    origin:['http://192.168.236.64:8080'],
    methods:['GET','POST'],
}));
app.all('*',function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', 'https://df70-165-84-247-65.ngrok-free.app');
  res.header('Access-Control-Allow-Origin', 'http://192.168.236.64:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json({limit: '600mb'}));
app.use(bodyParser.urlencoded({limit: '600mb', extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRouter);

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
