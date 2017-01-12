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

exports.countByActionWithResourceMatch = function (req, res) {
    var resourceMatch = req.query.resource ? RegExp(decodeURIComponent(req.query.resource)) : null;

    Logger.countByActionWithResourceMatch(req.params.action, resourceMatch).then(function(data){
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

exports.getErrors = function(req, res){
    Logger.getErrors(req.params.limit).then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(error){
        res.json(util.wrapBody(error, 'E'));
    });
};