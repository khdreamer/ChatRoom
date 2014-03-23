var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var backgroundPicture = new Schema({
	photo_id : String,
	img : Buffer,
})

mongoose.model('backgroundPicture' , backgroundPicture);
//mongoose.connect('mongodb://localhost/ChatRoom');