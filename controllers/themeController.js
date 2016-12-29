/**
 * Created by brillwill on 2016/12/29.
 */
var themeRepository = require("../repositories/themeRepository");
var util = require("../util/util");

exports.getThemeConfig = function(req, res){
    themeRepository.getLatestThemeConfig().then(function(config){
        return res.json(util.wrapBody(config));
    }).catch(util.responseInternalError(res));
};

exports.createThemeConfig = function(req, res){
    themeRepository.createThemeConfig(req.body).then(function(data){
        return res.json(util.wrapBody(data));
    }).catch(util.responseInternalError(res));
};

exports.createTheme = function(req, res){
    themeRepository.createTheme(req.body).then(function(data){
        return res.json(util.wrapBody(data));
    }).catch(util.responseInternalError(res));
};

exports.getThemeById = function(req, res){
    themeRepository.getThemeById(req.params.id).then(function(data){
        return res.json(util.wrapBody(data));
    }).catch(util.responseInternalError(res));
};

exports.getCandidateThemes = function(req, res){
    themeRepository.getLatestThemeConfig().then(function(config){
        return themeRepository.getThemesByCategory(config.category);
    }).catch(util.responseInternalError(res));
};