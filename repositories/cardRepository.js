/**
 * Created by brillwill on 2016/12/29.
 */
var Card = require("../models/card");
var CollectedCard = require("../models/collectedCard");

exports.getCardById = function(id){
    return Card.findById(id).populate("sender theme themeConfig").lean().exec();
};

exports.deleteCardById = function(id){
    return Card.findByIdAndRemove(id).lean().exec();
};

exports.getCardsBySender = function(user){
    return Card.find({sender:user}).populate("sender theme themeConfig").lean().exec();
};

exports.getLatestCardBySender = function(user){
    return Card.findOne({sender:user}).sort("-createDate").populate("sender theme themeConfig").lean().exec();
};

exports.createCard = function (param) {
    param.createDate = new Date();
    return Card.create(param).lean();
};

exports.listAllCards = function(){
    return Card.find().populate("sender theme themeConfig").sort("-createDate").lean().exec();
};

exports.getCollectedCardById = function(id){
    return CollectedCard.findById(id).deepPopulate('card.sender collector').lean().exec();
};

exports.deleteCollectedCardById = function(id){
    return CollectedCard.findByIdAndRemove(id).lean().exec();
};

exports.countCollectedCardsByUser = function(user){
    return CollectedCard.count({collector:user}).exec();
};

exports.isCardCollected = function(user, cardId){
    return CollectedCard.findOne({collector:user, card:cardId}).lean().exec();
};

exports.getCollectedCardsByUser = function(user){
    return CollectedCard.find({collector:user}).deepPopulate('card.sender collector').sort("createDate").lean().exec();
};

exports.createCollectedCard = function(param){
    param.createDate = new Date();
    return CollectedCard.create(param);
};

exports.listAllCollectedCards = function(){
    return CollectedCard.find().deepPopulate('card.sender collector').sort("-createDate").lean().exec();
};