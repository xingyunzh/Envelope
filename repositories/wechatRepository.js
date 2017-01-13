var q = require('q');
var crypto = require('crypto');
var https = require('https');
var fs = require('fs');
var stringHelper = require('../util/shared/stringHelper');
var systemConfigRepository = require('./systemConfigRepository');

var cacheFilePath = '/root/keys/cache.json';

exports.getConfigParams = function(url){
	return getJSApiTicket().then(function(ticket){

		var appId = systemConfigRepository.getWechatCredentials().camproz.appId;
		var nonceStr = stringHelper.randomString(10,'all');
		var timeStamp = Math.floor(new Date() / 1000);
		var string1 = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timeStamp + "&url=" + url;
		var signature = generateSignature(string1);

		return {
			appId:appId,
			nonceStr:nonceStr,
			timestamp:timeStamp,
			signature:signature
		};
	});
	
};

function getJSApiTicket(){
	var deferred = q.defer();

	var jsApiTicketCache = getFromCacheFile('jsApiTicket');

	if (!jsApiTicketCache.expiresIn || jsApiTicketCache.expiresIn < 60 * 2) {
		getAccessToken().then(function(accessToken){
			var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi";

			https.get(url, function(res){

				res.on('data', function(chunk){
				    var resJSON = JSON.parse(chunk);
				    if (resJSON.errcode == 0) {
				    	storeToCacheFile('jsApiTicket',{
				    		ticket:resJSON.ticket,
				    		expires_in:resJSON.expires_in
				    	});

				   		deferred.resolve(resJSON.ticket);
				    }else{
				    	deferred.reject(resJSON.errmsg);
				    }
				    
				});
			}).on('error', function(e){
				console.error(e);
				deferred.reject(e);
			});
		});
		
	}else{
		deferred.resolve(jsApiTicketCache.jsApiTicket);
	}

	return deferred.promise;
}

function getAccessToken(){
	var deferred = q.defer();

	var accessTokenCache = getFromCacheFile('accessToken');

	if (!accessTokenCache.expiresIn || accessTokenCache.expiresIn < 60 * 2) {

		var camproz = systemConfigRepository.getWechatCredentials().camproz;
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + 
					camproz.appId + 
					"&secret=" + 
					camproz.secret;

		https.get(url,function(res){

			res.on('data', function(chunk){
			    var resJSON = JSON.parse(chunk);
			    storeToCacheFile('accessToken',resJSON);

			    deferred.resolve(resJSON.access_token);
			});

		}).on('error', function(e){
			console.error(e);
			deferred.reject(e);
		});

	}else{
		deferred.resolve(accessTokenCache.accessToken);
	}

	return deferred.promise;
}

function storeToCacheFile(key,object){
	var cache = JSON.parse(fs.readFileSync(cacheFilePath,'utf8'));

	cache[key] = object;

	var cacheString = JSON.stringify(cache);

	fs.writeFileSync(cacheFilePath,cacheString,'utf8');
}

function getFromCacheFile(key){
	var cache = JSON.parse(fs.readFileSync(cacheFilePath,'utf8'));

	if (key in cache) {
		return cache[key];
	}else{
		return {};
	}
}

function generateSignature(string1){

	var sha1 = crypto.createHash('sha1');

	sha1.update(string1);

	return sha1.digest('hex');
}


