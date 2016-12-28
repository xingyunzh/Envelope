var CamproError = require('../models/CamproError');
var pinyin = require('pinyin');

exports.buildSearchRegExp = function(string){
	var alphabet = exports.alphabetize(string,{
		separator:'|'
	});

	var exp = "";

	if (alphabet.indexOf('|') == -1) {
		for(var i in alphabet){
			exp = exp + alphabet[i] + "[A-Za-z0-9\\|]*";
		}
	}else{
		exp = alphabet.replace('|','\\|');
	}

	return RegExp(exp,'i');
};

exports.alphabetize = function(string,options){
	var separator = "";
	if (!!options && 'separator' in options) {
		separator = options.separator;
	}

	var pinyinArray = pinyin(string,{
		style:pinyin.STYLE_NORMAL
	});

	var pinyinString = "";
	for(var i in pinyinArray){
		if (i > 0) pinyinString = pinyinString + separator;
	  	pinyinString = pinyinString + pinyinArray[i];
	}

	return pinyinString;
};

exports.paging = function(model,conditions,options,population) {
	var totalCount = null;

	return model.count(conditions).then(function(result){
		totalCount = result;

		var pageNum = 0;
		var pageSize = 10;

		if ('pageNum' in options) {
			pageNum = options.pageNum;
		}

		if ('pageSize' in options) {
			pageSize = options.pageSize;
		}

		var skipped = pageNum * pageSize;

		if (totalCount > 0 && skipped >= totalCount) {
			throw new CamproError('Invalid Parameter: pageNum=' + pageNum);
		}

		return model
			.find(conditions)
			.skip(skipped)
			.limit(pageSize)
			.populate(population)
			.lean()
			.exec();

	}).then(function(result){
		return {
			total:totalCount,list:result
		};
	});
};