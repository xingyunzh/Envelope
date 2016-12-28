var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = Schema({
	name:String,

	url:String,

	type:Number
});

var Image = mongoose.model("Image", imageSchema);

module.exports = Image; 