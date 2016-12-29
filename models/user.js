var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
	name:String,

	alphabetName:[{
		type:String,
		index:true
	}],

	nickname:{
		type:String
	},

	uid:String,
	headImgUrl:String
});

var User = mongoose.model("User", userSchema);

module.exports = User;