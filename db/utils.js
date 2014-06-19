module.exports = function(mongoose) {

  // DATABASE MODELS
  var models = require('./models')(mongoose);

  return {

    getMongooseInstance: function() {
      return mongoose;
    },

    getModel: function(collection) {
      return models[collection] || false;
    }

  };
};