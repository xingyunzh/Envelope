/**
 * Created by brillwill on 16/10/12.
 */
var util = require('../util/util.js');
var fs = require('fs');
var shortID = require('shortid');
var systemConfigRepository = require('../repositories/systemConfigRepository');

exports.getOSSConfig = function(req, res){
    systemConfigRepository.getOSSConfig().then(function(data){
        res.json(util.wrapBody(data));
    }).catch(function(err){
        res.json(util.wrapBody(err, "E"));
    });
}

exports.getShortID = function (req, res) {
    res.json(util.wrapBody(shortID.generate()));
}