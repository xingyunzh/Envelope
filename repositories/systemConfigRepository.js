/**
 * Created by brillwill on 16/11/8.
 */
var fs = require('fs');
var q = require('q');

var cacheHere = null;
var SystemConfigKeysFile = "/root/keys/envelopeKeys.json";

exports.getOSSConfig = function(){
    var deferred = q.defer();
    fs.readFile("SystemConfigKeysFile", "utf8", function(err, data){
        if (err) {
            deferred.reject(err);
        }
        else {
            var aliyunOSS = JSON.parse(data).aliyunOSS;
            deferred.resolve(aliyunOSS);
        }
    });

    return deferred.promise;
};

exports.getWechatCredentials = function(){
    var data = fs.readFileSync(SystemConfigKeysFile, "utf8");
    var wechat = JSON.parse(data).wechat;
    return wechat;
};

exports.getMongoEnv = function(){

    var data = fs.readFileSync(SystemConfigKeysFile, "utf8");
    var mongodb = JSON.parse(data).mongodb;
    return mongodb;
};

exports.getTokenSecret = function(){
    var data = fs.readFileSync(SystemConfigKeysFile, "utf8");
    var jwt = JSON.parse(data).jwt;
    return jwt;
}
