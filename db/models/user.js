module.exports = function(mongoose, models) {

  var userSchema = mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: { type: String, select: false },
    confirmationCode: { type: String, default: Date.now() },
    isConfirmed: { type: Boolean, default: false },
    avatarUrl: { type: String, default: '/etc/designs/odin/clientlibs/images/personalization/profile-pic.png' }
  });

  models.users = mongoose.model('User', userSchema);

};