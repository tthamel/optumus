(function () {
  'use strict';

  var SEARCH_KEYWORDS = [
    'aching',
    'allergy',
    'allergies',
    'alzheimers',
    'asthma',
    'asthma attack',
    'asthma medicine',
    'blood',
    'blood pressure',
    'bloody sneezing',
    'brain cancer',
    'breast cancer',
    'cancer',
    'chest',
    'chest pain',
    'chest pains',
    'cold coughing',
    'congested malam',
    'congested nose',
    'congestion',
    'coughing',
    'cough',
    'dangerous allergy',
    'deaths',
    'death',
    'dementia',
    'fever',
    'flu',
    'food allergy',
    'headaches',
    'headache',
    'hearing loss',
    'heart',
    'heathcare costs',
    'loud coughing',
    'night sweats',
    'pain',
    'painful coughing',
    'PDSD',
    'powerful asthma medicine',
    'sharp pain',
    'shortness',
    'sick feeling',
    'sinus',
    'sneezes',
    'sneezing',
    'sneeze',
    'sore',
    'sore throat',
    'stress',
    'stuffy nose',
    'symptom',
    'symptoms',
    'toxic load',
    'Optum',
    'UHC',
    'United Health Care',
    'UHG',
    'AARP Health',
    'OptumRx'
  ];

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

  var Twitter = require('node-twitter');
  var twitterStreamClient = new Twitter.StreamClient(
    'NsCqa2yS6DpA3YQEZGOT2nBJq',
    'KvcED4ctI3K8aIU8ldIU2zfiCx2IVUN0bJEX3BC28FYKHpQ1MD',
    '454062066-Ks1gCApBuvl6dCmhjEzXHBcLKBR3eA0uvcaJMYWF',
    'b8AJBVTt6bE5kdzQtZnuhwfFg53Wn4MBQszqeFvQmgun4'
  );

  var app = express();
  var http = require('http');
  var server = http.createServer(app);
  var io = require('socket.io').listen(server);

  // SOCKET IO CODE
  io.on('connection', function (socket) {
    console.log('connected');

    twitterStreamClient.on('tweet', function (tweet) {
      SEARCH_KEYWORDS.forEach(function (keyword) {
        if(tweet.text.indexOf(keyword) >= 0) tweet.keyword = keyword;
      });
      io.sockets.emit('tweet', tweet);
    });
  });

  twitterStreamClient.start(SEARCH_KEYWORDS);

  // view engine setup
  app.set('views', path.join(__dirname, 'app'));
  app.set('view engine', 'ejs');

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
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error/error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 3000);

  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
  });

  // Mongoose!
  mongoose.connect('mongodb://localhost/hackathon');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Successfully connected to MongoDB server!');
  });

}());
