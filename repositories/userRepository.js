var User = require('../models/user.js');
var repositoryUtil = require('./repositoryUtil');

exports.findByUid = function(uid) {
	return User.findOne({uid:uid}).lean().exec();
};

exports.findById = function(id){
	return User.findById(id).lean().exec();
};

exports.create = function(data){
	data.alphabetName = repositoryUtil.alphabetize(data.nickname,{
		separator:'|'
	});

	return User.create(data);
};

exports.updateById = function(id,data){
	data.editDate = new Date();

	if ('nickname' in data) data.alphabetName = repositoryUtil.alphabetize(data.nickname,{
		separator:'|'
	});

	return User.findByIdAndUpdate(id,data,{
		new:true,
		upsert:false
	}).exec();
};

exports.countUser = function(){
	return User.count().lean().exec();
};

exports.query = function(options){
	var conditions = {};

	if ('nickname' in options) {
		conditions.alphabetName = repositoryUtil.buildSearchRegExp(options.nickname);
	}

	return repositoryUtil.paging(User,conditions,options,'');

};