/**
 * Created by brillwill on 2017/1/6.
 */
var Log = require("../models/log");
var q = require("q");

function create(params){
    params.date = new Date();
  return Log.create(params);
};

exports.countByAction = function(action){
  return Log.count({action:action}).exec();
};

exports.countByActionWithResourceMatch = function(action, resourceRegExp){
    var condition = {action:action};
    if(resourceRegExp){
        condition.resource = resourceRegExp;
    }

    return Log.count(condition).exec();
};

exports.countByUser = function(user){
    return Log.count({user:user}).exec();
};

exports.getRecent = function(limitMax){
    return Log.find().sort("-date").limit(limitMax).lean().exec();
};

exports.getErrors = function(limitMax){
    return Log.find({action:this.ActionType.Error}).sort("-date").limit(limitMax).lean().exec();
};

//convenient methods
exports.add = function(action, resource, req){
    if(req && !req.app.locals.logging){
        return q.fcall(function(){
            return "logging is not enable!";
        });
    }

    this.getClientIp = function(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    };

    return create({
        action:action,
        resource:resource,
        user:req && req.token ? req.token.userId : null,
        ip:req ? this.getClientIp(req) : null
    });
};


//data
exports.ActionType = {
    View:'v',
    Login:'i',
    Create:'c',
    Collect:'l',
    Error:'e'
};