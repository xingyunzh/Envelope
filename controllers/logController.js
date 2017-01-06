/**
 * Created by brillwill on 2017/1/6.
 */
var Logger = require('../repositories/logRepository');
var util = require('../util/util');

//not supposed to be used in production
exports.create = function(req, res){
    Logger.create(req.body).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};

exports.countByAction = function (req, res) {
    Logger.countByAction(req.params.action).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};

exports.countByUser = function (req, res) {
    Logger.countByUser(req.params.id).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};

exports.countByResourceMatch = function (req, res) {
    Logger.countByUser(req.params.reg).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};

exports.getRecent = function(req, res){
    Logger.getRecent(req.params.limit).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};