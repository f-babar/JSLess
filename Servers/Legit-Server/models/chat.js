const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
	user_id: String,
	chat_message: String,
}, {
		timestamps: true
	});

module.exports = mongoose.model('Chat', ChatSchema);
