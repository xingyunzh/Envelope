
var jwt = require('jsonwebtoken');
var util = require('../util/util');
var q = require('q');
var systemConfigRepository = require('../repositories/systemConfigRepository');

module.exports.create = function(userId){
	return generate(userId);
};

function generate(id){
    return systemConfigRepository.getTokenSecret().then(function(jwt){
        return q.nfcall(jwt.sign,{
            userId:id
        },jwt.secret,{
            expiresIn:60 * 60 * 24 * 45
        });
    });
}

module.exports.pass = function(req, res, next){
    var tokenString = req.get('x-access-token');
    if(!!tokenString){
        jwt.verify(tokenString,getSecret(),function(err,tokenObject){
            if (!err) {
                req.token = tokenObject;
            }
            next();
        });
    }
    else {
        next();
    }
};

module.exports.authenticate = function(req, res, next) {
	if (!req.token) {
		res.send(util.wrapBody('Invalid token','E'));
	}else {
        if (req.token.exp - Math.floor(Date.now() / 1000) < 6 * 60 * 60) {
            generate(req.token.userId).then(function(newTokenString){
                res.setHeader('set-token', newTokenString);
                next();
            }).catch(function(err){
                console.log(err);
                res.send(util.wrapBody('Internal Error', 'E'));
            });

        } else {
            next();
        }
	}
};

module.exports.adminAuthenticate = function(req, res, next){
    var adminToken = req.get('x-admin-token');
    if(!adminToken){
        res.send(util.wrapBody('Not Authorized!', 'E'));
    }
    else {
        scr.getAdminToken().then(function(token){
            if(token == adminToken){
                next();
            }
            else {
                res.send(util.wrapBody('Not Authorized!', 'E'));
            }
        }).catch(function(error){
            res.send(util.wrapBody('Not Authorized! error=' + error, 'E'));
        });
    }
};