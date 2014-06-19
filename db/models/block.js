module.exports = function(mongoose, models) {

  var blockSchema = mongoose.Schema({
    username: String,
    content: String
  });

  models.blocks = mongoose.model('Block', blockSchema);

};