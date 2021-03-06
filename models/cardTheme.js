/**
 * Created by brillwill on 2016/12/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardThemeSchema = Schema({
    category:{
        type:String,
        required:true,
        index:true
    },
    name:String,
    createDate:Date,
    cardTemplate:String,
    imageURL:String,

    title:String
});

var CardTheme = mongoose.model("CardTheme", CardThemeSchema);

module.exports = CardTheme;