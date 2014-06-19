var express = require('express');
var router = express.Router();

// MIDDLEWARE (PRE RESPONSE)
router.use(function(req, res, next) {

  // log each request to the console
  console.log(req.method, req.url);

  // continue doing what we were doing and go to the route
  next();
});

function index(req, res) {
  res.render('index', { title: 'Hackathon' });
}

/* GET users listing. */
router.get('/', index);

router.get('/partial/:view', function(req, res) {
  var view = req.params.view;
  res.render( view +'/' + view, { title: view });
});

// Handles a single directory then view combination
router.get('/partial/:direc/:view', function(req, res) {
  var direc = req.params.direc;
  var view = req.params.view;
  res.render( direc +'/' + view, { title: view });
});

// Handles two directories then view combination
router.get('/partial/:direc1/:direc2/:view', function(req, res) {
  var direc1 = req.params.direc1;
  var direc2 = req.params.direc2;
  var view = req.params.view;
  res.render( direc1 +'/' + direc2 +'/' + view, { title: view });
});

router.get('*', index);

module.exports = router;