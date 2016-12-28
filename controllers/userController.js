var userRepository = require('../repositories/userRepository');
var uidHelper = require('../util/uidHelper');
var util = require('../util/util');
var stringHelper = require('../util/shared/stringHelper');
var authenticator = require('../authenticate/authenticator');
var q = require('q');
var CamproError = require('../models/CamproError');

exports.loginByEmail = function(req,res){

	if (!util.checkParam(req.body,['email','password'])) {
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{
		login(req,res,'email');
	}
};

exports.loginByWechat = function(req,res){
	if (!util.checkParam(req.body,['code'])) {
		res.send(util.wrapBody('Invalid Parameter','E'));
	}else{
		login(req,res,'wechat');
	}
};

exports.update = function(req,res){
	var id = req.token.userId;

	userRepository.updateById(id, req.body).then(function(result){
        res.send(util.wrapBody(result));
    }).catch(function(err){
        console.log(err);
        res.send(util.wrapBody('Internal Error','E'));
    });
};

exports.getProfileById = function(req,res){
	var id = req.params.id;

    userRepository.findById(id).then(function(result){
        var responseBody = {
            user:result
        };
        res.send(util.wrapBody(responseBody));
    }).catch(function(err){
        console.log(err);
        res.send(util.wrapBody('Internal Error','E'));
    });
};

exports.listUser = function(req,res){
	var conditions = req.query;

	userRepository
	.query(conditions)
	.then(function(result){
		res.send(util.wrapBody({
			total:result.total,
			users:result.list
		}));
	}).catch(function(err){
		console.log(err);
		if (err instanceof CamproError) {
			res.send(util.wrapBody(err.customMsg,'E'));
		} else {
			res.send(util.wrapBody('Internal Error','E'));
		}
	});
};

function login(req,res,type){
	var isFirstTimeLogin = false;

	var deferred = q.defer();
	if (type == 'email') {
		var email = req.body.email;
		var	password = req.body.password;

		uidHelper.loginByEmail(email,password,function(err,result){
			if (err) {
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
		});
	}else if(type == 'wechat'){
		var code = req.body.code;
		uidHelper.loginByWechat(code,function(err,result){
			if (err) {
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
		});
	}else{
		console.log('Invalid Type:',type);
		deferred.reject(new Error('Internal Error'));
	}

	deferred.promise.then(function getProfile(result){
		var user = result.user;

		if (!user) {
			return null;
		}

		return userRepository
		.findByUid(user._id)
		.then(function(userResult){
			if(userResult == null){
				isFirstTimeLogin = true;
				//return importProfile(user);
				var newUser = {
					uid:user._id,
					headImgUrl:user.headImgUrl,
					roles:['player']
				};

				if (!!user.nickname) {
					newUser.nickname = user.nickname;
				} else {
					newUser.nickname = '新用户' + stringHelper.randomString(4,'all');
				}

				return userRepository.create(newUser);
			}else{
				return userResult;
			}
		});
	}).then(function generateToken(user){
		if (!user) {
			return null;
		}

		var deferred = q.defer();

		authenticator.create(user._id,function(err,newToken){
			if (err) {
				deferred.reject(err);
			}else{
				res.setHeader('set-token',newToken);
				deferred.resolve(user);
			}				
		});

		return deferred.promise;
	}).then(function sendResponse(user){
		
		var responseBody = {
			user:user,
			isFirstTimeLogin:isFirstTimeLogin
		};

		res.send(util.wrapBody(responseBody));
	}).catch(function(err){
		console.log(err);
		res.send(util.wrapBody('Internal Error','E'));
	});

}

// function importProfile(user){

// 	var imageName = stringHelper.randomString(10,['lower','digit']);

// 	imageName = globalNameForFile(imageName,user);

// 	return imageRepository
// 	.getFromUrl(imageName,user.headImageUrl)
// 	.then(function(tempPath){
// 		return imageRepository.putToOSS(imageName,tempPath);
// 	}).then(function(res){
		
// 		var newUser = {
// 			uid:user._id,
// 			headImageUrl:res.url
// 		};

// 		if (!!user.nickname) {
// 			newUser.nickname = user.nickname;
// 		} else {
// 			newUser.nickname = '新用户' + stringHelper.generate(4,'all');
// 		}

// 		return userRepository.create(newUser);
// 	});

// }
