(function(){
  'use strict';

  var express = require('express');
  var path = require('path');
  var favicon = require('static-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var cors = require('cors');
  var mongoose = require('mongoose');
  var dbUtils = require('./db/utils')(mongoose);
  var routes = require('./routes/index');
  var routesApi = require('./routes/api')(dbUtils);

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'app'));
  app.set('view engine', 'jade');

  app.use(cors());
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Routes
  app.use('/api', routesApi);
  // todo: /users

  // This one has to be last as it has the wildcard (*) catchall to let angular route
  app.use('/', routes);

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error/error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  // Mongoose!
  mongoose.connect('mongodb://localhost/hackathon');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    console.log('Successfully connected to MongoDB server!');
  });

}());