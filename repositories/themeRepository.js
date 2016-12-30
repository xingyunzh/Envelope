/**
 * Created by brillwill on 2016/12/29.
 */
var Theme = require("../models/cardTheme");
var ThemeConfig = require("../models/themeConfig.js");

exports.getThemeById = function(id){
    return Theme.findById(id).lean().exec();
};

exports.getThemesByCategory = function(category){
    return Theme.find({category:category}).sort("-createDate").lean().exec();
};

exports.createTheme = function (param) {
    param.createDate = new Date();
    return Theme.create(param);
};

exports.createThemeConfig = function(param){
    param.createDate = new Date();
    return ThemeConfig.create(param);
};

exports.getLatestThemeConfig = function() {
    return ThemeConfig.find().sort("-createDate").limit(1).lean().exec().then(function(configs){
        return configs[0];
    });
};

exports.updateTheme = function(id, content){
    return Theme.findByIdAndUpdate(id, content).lean().exec();
};

exports.updateThemeConfig = function(id, content){
    return ThemeConfig.findByIdAndUpdate(id, content).lean().exec();
};

exports.listAllThemes = function () {
    return Theme.find().sort("-createDate").lean().exec();
};

exports.listAllThemeConfigs = function(){
    return ThemeConfig.find().sort("-createDate").lean().exec();
};