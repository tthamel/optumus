(function () {
  'use strict';

  var SEARCH_KEYWORDS = [
    'hospital',
    'uhg',
    'uhc',
    'heart',
    'pharma',
    'healthy',
    'medicare',
    'caregiving',
    'diabetic',
    'illness',
    'disease',
    'addiction',
    'virus',
    'medication',
    'aching',
    'allergy',
    'allergies',
    'alzheimers',
    'asthma attack',
    'asthma medicine',
    'blood pressure',
    'bloody sneezing',
    'cancer',
    'chest pain',
    'chest pains',
    'cold coughing',
    'congested',
    'congestion',
    'coughing',
    'cough',
    'dangerous allergy',
    'dementia',
    'fever',
    'flu',
    'food allergy',
    'headaches',
    'headache',
    'hearing loss',
    'heart pain',
    'heart attack',
    'heathcare',
    'loud coughing',
    'night sweats',
    'pain',
    'painful coughing',
    'PDSD',
    'powerful asthma medicine',
    'sharp pain',
    'sick feeling',
    'sickness',
    'sinus',
    'sneezes',
    'sneezing',
    'sneeze',
    'sore throat',
    'stress',
    'stuffy nose',
    'symptom',
    'symptoms',
    'toxic load',
    'Optum',
    'UnitedHealth',
    'AARP Health',
    'OptumRx',
    'medx',
    'medicine',
    'painkillers',
    'autism',
    'smoking',
    'obesity',
    'overweight',
    'heart monitor',
    'heart rate',
    'lungs',
    'lung cancer',
    'infertility',
    'insomnia',
    'diabetes',
    'tumor',
    'depression',
    'arthritis'
  ];

  var sample_json = require('./public/js/samples.json');

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
  var request = require('request');
  var say = require('say');
  var _ = require('lodash');

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

  app.get('/profile_images/:id/:photo', function(req, res) {
    request('http://pbs.twimg.com/profile_images/' + req.params.id + '/'+ req.params.photo).pipe(res);
  });

  app.post('/tweet-speak', function(req, res) {
    say.speak('Vicki', req.body.text);
    res.send(200);
  });

  app.post('/tweet-spam', function(req, res) {
    request({
      url: 'http://hackathon.hollow.io/',
      json: true,
      qs: {
        term: req.body.keyword,
        limit: 100
      }
    }, function (err, res, body) {
        _.chain(sample_json).shuffle().first(_.random(50, 500)).each(function (tweet) {
          var sample = _.sample(body.results);
          tweet.text = (sample && sample.Contents) || tweet.text;
          tweet.user.profile_image_url = "localtweets/" + tweet.user.profile_image_url.split('/').pop();
          tweet.fake = true;
          io.sockets.emit('tweet', tweet);
        }).value();
    });
    res.send(200);
  });

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
