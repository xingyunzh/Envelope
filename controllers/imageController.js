var imageRepository = require('../repositories/defaultImageRepository');
var util = require('../util/util');

var types = ['other','user','team','idea','project'];


exports.addNewImage = function(req,res) {
	
	if(util.checkParam(req.body,['name','url','type'])){
		var data = req.body;

		if('_id' in data) delete data._id;
		data.type = types.indexOf(data.type);

		imageRepository.create(data).then(function(image){
			image.type = types[image.type];
			res.send(util.wrapBody({image:image}));
		}).catch(function(err){
			console.log(err);
			res.send(util.wrapBody('Internal Error'));
		});
	}else{
		res.send(util.wrapBody('Invalid Parameter','E'));
	}

	
};

exports.getImageById = function(req,res){
	var id = req.params.id;

	imageRepository.findById(id).then(function(image){
		image.type = types[image.type];
		res.send(util.wrapBody({image:image}));
	}).catch(function(err){
		console.log(err);
		res.send(util.wrapBody('Internal Error'));
	});
};

exports.getImagesByType = function(req,res){
	var options = req.query;

	options.type = types.indexOf(req.params.type);

	if(util.checkParam(req.query,['type'])){

		imageRepository.query(options).then(function(result){
			for (var i = result.images.length - 1; i >= 0; i--) {
				result.images[i].type = types[result.images[i].type];
			}
			res.send(util.wrapBody(result));
		}).catch(function(err){
			console.log(err);
			res.send(util.wrapBody('Internal Error'));
		});
	}else{
		res.send(util.wrapBody('Invalid Parameter','E'));
	}

};

