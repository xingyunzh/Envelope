var q = require('q');
var crypto = require('crypto');
var https = require('https');
var fs = require('fs');
var stringHelper = require('../util/shared/stringHelper');
var systemConfigRepository = require('./systemConfigRepository');

var cacheFilePath = '/root/cache/cache.json';

var refreshTime = 2 * 60;

exports.getConfigParams = function(url){

	return getJSApiTicket().then(function(ticket){

		return systemConfigRepository.getWechatCredentials().then(function(wechat){
			var appId = wechat.camproz.appId;
			var nonceStr = stringHelper.randomString(10,'all');
			var timeStamp = getTimestamp();
			var string1 = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timeStamp + "&url=" + url;
			console.log(string1);
			var signature = generateSignature(string1);

			return {
				appId:appId,
				nonceStr:nonceStr,
				timestamp:timeStamp,
				signature:signature
			};
		});

	});
	
};

function getJSApiTicket(){

	return getFromCacheFile('jsApiTicket').then(function(jsApiTicketCache){

		if (!jsApiTicketCache.expiresAt || jsApiTicketCache.expiresAt - getTimestamp() < refreshTime) {

			return getAccessToken().then(function(accessToken){

				var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi";

				var deferred = q.defer();

				https.get(url, function(res){

					res.on('data', function(chunk){
					    var resJSON = JSON.parse(chunk);
					    if (resJSON.errcode == 0) {
					    	var promise = storeToCacheFile('jsApiTicket',{
					    		ticket:resJSON.ticket,
					    		expiresAt:getTimestamp() + resJSON.expires_in
					    	}).then(function(){
					    		return resJSON.ticket;
					    	});

					   		deferred.resolve(promise);
					    }else{
					    	deferred.reject(resJSON.errmsg);
					    }
					    
					});
				}).on('error', function(e){
					console.error(e);
					deferred.reject(e);
				});

				return deferred.promise;
			});
			
		}else{

			return jsApiTicketCache.ticket;
		}
	});


}

function getAccessToken(){

	return getFromCacheFile('accessToken').then(function(accessTokenCache){

		if (!accessTokenCache.expiresAt || accessTokenCache.expiresAt - getTimestamp() < refreshTime) {

			return systemConfigRepository.getWechatCredentials().then(function(wechat){

				var camproz = wechat.camproz;

				var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + 
						camproz.appId + "&secret=" + camproz.secret;

				var deferred = q.defer();

				https.get(url,function(res){

					res.on('data', function(chunk){
					    var resJSON = JSON.parse(chunk);

					    var promise = storeToCacheFile('accessToken',{
					    	accessToken:resJSON.access_token,
					    	expiresAt:getTimestamp() + resJSON.expires_in
					    }).then(function(){
					    	return resJSON.access_token;
					    });

					    deferred.resolve(promise);
					    
					});

				}).on('error', function(e){
					console.error(e);
					deferred.reject(e);
				});

				return deferred.promise;
				
			});

		}else{

			return accessTokenCache.accessToken;
		}
	});
}

function storeToCacheFile(key,object){
	return q.nfcall(fs.readFile,cacheFilePath,'utf8').then(function(cacheString){

		var cache = JSON.parse(cacheString);

		cache[key] = object;

		var newCacheString = JSON.stringify(cache);

		return q.nfcall(fs.writeFile,cacheFilePath,newCacheString,'utf8');
	});
}

function getFromCacheFile(key){

	return q.nfcall(fs.readFile,cacheFilePath,'utf8').then(function(cacheString){
		var cache = JSON.parse(cacheString);

		if (key in cache) {
			return cache[key];
		}else{
			return {};
		}
	});
}

function generateSignature(string1){

	var sha1 = crypto.createHash('sha1');

	sha1.update(string1);

	return sha1.digest('hex');
}

function getTimestamp(){
	return Math.floor(new Date() / 1000);
}


