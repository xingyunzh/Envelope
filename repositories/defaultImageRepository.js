var Image = require('../models/defaultImage');

exports.create = function(data) {
	return Image.create(data);
};

exports.findById = function(id){
	return Image.findById(id).lean().exec();
};

exports.query = function(options){
	

	var conditions = {};

	if ('type' in options) {
		conditions.type = options.type;
	}

	var totalCount = null;

	return Image
		.count(conditions)
		.then(function(result){
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

			if (pageSize >= totalCount) {
				skipped = 0;
			}else if (skipped >= totalCount) {
				skipped = total - pageSize;
			}

			return Image
				.find(conditions).populate("innovator consultant")
				.skip(skipped)
				.limit(pageSize)
				.exec();

		}).then(function(result){
			return {total:totalCount,images:result};
		});

};