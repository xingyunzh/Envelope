/**
 * Created by brillwill on 2016/12/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectedCardSchema = Schema({
    collector:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    card:{
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: true,
    },
    createDate:Date
});

var CollectedCard = mongoose.model("CollectedCard", collectedCardSchema);

module.exports = CollectedCard;