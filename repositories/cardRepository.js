/**
 * Created by brillwill on 2016/12/29.
 */
var Card = require("../models/card");
var CollectedCard = require("../models/collectedCard");

exports.getCardById = function(id){
    return Card.findById(id).populate("sender theme").lean().exec();
};

exports.getCardsBySender = function(user){
    return Card.find({sender:user}).populate("sender theme").lean().exec();
};

exports.getLatestCardBySender = function(user){
    return Card.find({sender:user}).sort("-createDate").populate("sender theme").limit(1).exec().then(function(cards){
        return cards[0];
    });
};

exports.createCard = function (param) {
    param.createDate = new Date();
    return Card.create(param);
};

exports.listAllCards = function(){
    return Card.find().populate("sender theme").sort("-createDate").lean().exec();
};

exports.countCollectedCardsByUser = function(user){
    return CollectedCard.count({collector:user}).exec();
}

exports.getCollectedCardsByUser = function(user){
    return CollectedCard.find({collector:user}).sort("createDate").populate("card", "sender theme").exec();
};

exports.createCollectedCard = function(param){
    param.createDate = new Date();
    return CollectedCard.create(param);
};

exports.listAllCollectedCards = function(){
    return CollectedCard.find().sort("-createDate").populate("card", "sender theme").exec();
};