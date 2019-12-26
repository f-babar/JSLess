const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	first_name: String,
  last_name: String,
  username: String,
	email: String,
	password: String,
}, {
		timestamps: true  
	});

module.exports = mongoose.model('User', UserSchema);
