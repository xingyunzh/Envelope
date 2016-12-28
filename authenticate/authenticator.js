
var jwt = require('jsonwebtoken');
var util = require('../util/util');
var scr = require('../repositories/systemConfigRepository');

var secret = null;

function getSecret(){
	if (secret) {
		return secret;
	}else{
		secret = scr.getTokenSecret().secret;
		return secret;
	}

}

// module.exports.verify = function(tokenString,callback){
// 	jwt.verify(tokenString,getSecret(),callback);
// };

module.exports.create = function(userId,callback){
	generate(userId,callback);
};

function generate(id,callback){
	jwt.sign({
		userId:id
	},getSecret(),{
		expiresIn:60 * 60 * 24
	},callback);
}

module.exports.authenticate = function(req, res, next) {

	var tokenString = req.get('x-access-token');

	if (!tokenString) {
		res.send(util.wrapBody('Invalid token','E'));
	}else{
		jwt.verify(tokenString,getSecret(),function(err,tokenObject){
			if (err) {
				console.log(err);
				res.send(util.wrapBody('Invalid token','E'));
			}else{
				req.token = tokenObject;

				if (tokenObject.exp - Math.floor(Date.now() / 1000) < 6 * 60 * 60) {
					generate(tokenObject.userId,function(err,newTokenString){
						if(err){
							console.log(err);
							res.send(util.wrapBody('Internal Error','E'));
						}else{
							res.setHeader('set-token',newTokenString);
							next();
						}
						
					});

				}else{
					next();
				}
				
			}
		});
	}
};