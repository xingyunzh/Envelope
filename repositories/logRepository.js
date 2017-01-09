/**
 * Created by brillwill on 2017/1/6.
 */
var Log = require("../models/log");

exports.create = function(params){
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

//convenient methods
exports.add = function(action, resource, user){
    return this.create({
        action:action,
        resource:resource,
        user:user
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