module.exports = function(mongoose){
  var models = {};

  var user = require('./models/user')(mongoose, models);

  return models;
};