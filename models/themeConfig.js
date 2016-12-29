/**
 * Created by brillwill on 2016/12/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var themeConfigSchema = Schema({
    category:{
        type:String,
        required:true,
        index:true
    },
    textCandidates:[String],

    createDate:Date
});

var ThemeConfig = mongoose.model("ThemeConfig", themeConfigSchema);

module.exports = ThemeConfig;