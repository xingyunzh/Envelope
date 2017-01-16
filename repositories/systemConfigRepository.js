/**
 * Created by brillwill on 16/11/8.
 */
var fs = require('fs');
var q = require('q');

var cacheHere = {};
var SystemConfigKeysFile = "/root/keys/envelopeKeys.json";

exports.getWechatCredentials = function(){
    if ('wechat' in cacheHere) {
        return q.fcall(function(){
            return cacheHere.wechat;
        });
    }else{
        return q.nfcall(fs.readFile, SystemConfigKeysFile, "utf8").then(function(data){
            cacheHere.wechat = JSON.parse(data).wechat;
            return cacheHere.wechat; 
        });
    }
    
};

exports.getMongoEnv = function(){

    var data = fs.readFileSync(SystemConfigKeysFile, "utf8");
    var mongodb = JSON.parse(data).mongodb;
    return mongodb;
};

exports.getTokenSecret = function(){

    if ('jwt' in cacheHere) {
        return q.fcall(function(){
            return cacheHere.jwt;
        });
    }else{
        
        return q.nfcall(fs.readFile, SystemConfigKeysFile, "utf8").then(function(data){
            cacheHere.jwt = JSON.parse(data).jwt;
            return cacheHere.jwt; 
        });
    }
};

exports.getAdminToken = function(){
    return q.nfcall(fs.readFile, SystemConfigKeysFile, "utf8").then(function(data){
        var admin = JSON.parse(data).admin;
        return admin;
    });
};
