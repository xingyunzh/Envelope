var q = require('q');
var crypto = require('crypto');
var https = require('https');
var stringHelper = require('../util/shared/stringHelper');
var systemConfigRepository = require('./systemConfigRepository');

var accessTokenCache = {
	accessToken:'',
	expiresIn:0
};

var jsApiTicketCache = {
	jsApiTicket:'',
	expiresIn:0
};

exports.getConfigParams = function(url){
	return getJSApiTicket().then(function(ticket){

		var appId = systemConfigRepository.getWechatCredentials().camproz.appId;
		var nonceStr = stringHelper.randomString(10,'all');
		var timeStamp = new Date().getTime();
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

exports.getJSApiTicket = function() {
	return getJSApiTicket();
};

function getJSApiTicket(){
	var deferred = q.defer();

	if (!jsApiTicketCache.jsApiTicket || jsApiTicketCache.expiresIn < 60 * 2) {
		getAccessToken().then(function(accessToken){
			var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi";

			https.get(url, function(res){
				// console.log('statusCode:', res.statusCode);
			 //    console.log('headers:', res.headers);

				res.on('data', function(chunk){
				    var resJSON = JSON.parse(chunk);
				    if (resJSON.errcode == 0) {
				    	jsApiTicketCache.jsApiTicket = resJSON.ticket;
					    jsApiTicketCache.expiresIn = resJSON.expires_in;

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
};

function getAccessToken(){
	var deferred = q.defer();

	if (!accessTokenCache.accessToken || accessTokenCache.expiresIn < 60 * 2) {
		var camproz = systemConfigRepository.getWechatCredentials().camproz;
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" 
				+ camproz.appId
				+ "&secret="
				+ camproz.secret;

		https.get(url,function(res){
		    // console.log('statusCode:', res.statusCode);
		    // console.log('headers:', res.headers);

			res.on('data', function(chunk){
			    var resJSON = JSON.parse(chunk);
			    accessTokenCache.accessToken = resJSON.access_token;
			    accessTokenCache.expiresIn = resJSON.expires_in;

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

function generateSignature(string1){

	var sha1 = crypto.createHash('sha1');

	sha1.update(string1);

	return sha1.digest('hex');
}


