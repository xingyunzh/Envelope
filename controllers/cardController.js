/**
 * Created by brillwill on 2016/12/29.
 */
var cardRepository = require("../repositories/cardRepository");
var themeRepository = require("../repositories/themeRepository");
var util = require("../util/util");
var fs = require("fs");
var q = require("q");

var theSpecificSenderDataPlaceHolder = "'theSpecificSenderDataPlaceHolderToReplace'";
var theMetaDescContentPlaceHolder = "theHeadMetaDescriptionContent";

function populateCardHtml(html, card){
    var theSpecificSenderData = {
        theCardTheme:card.theme,
        theCardText:card.text,
        theCardDescription:card.text,
        theCardSender:card.sender
    };

    var cardHtml = html.replace(theMetaDescContentPlaceHolder, card.text);
    cardHtml = cardHtml.replace(theSpecificSenderDataPlaceHolder, JSON.stringify(theSpecificSenderData));
    return cardHtml;
}

exports.getCardViewByUserId = function(req, res){
    var actions = [];
    actions[0] = q.nfbind(fs.readFile)("./views/card.html", "utf-8");
    actions[1] = cardRepository.getLatestCardBySender(req.params.id);

    q.all(actions).then(function(dataGroup){
        var cardHtml = dataGroup[0];
        var card = dataGroup[1];
        if(card){
            cardHtml = populateCardHtml(cardHtml, card);
        }

        res.send(cardHtml);
    }).catch(util.responseInternalError(res));
};

exports.createCard = function(req, res){
    cardRepository.createCard(req.body).then(function (card) {
        res.json(util.wrapBody(card));
    }).catch(util.responseInternalError(res));
};

exports.getCardById = function(req, res){
    cardRepository.getCardById(req.params.id).then(function(card){
        return util.wrapBody(card);
    }).catch(util.responseInternalError(res));
};

exports.collectCard = function(req, res){
    cardRepository.getLatestCardBySender(req.body.sender).then(function(card){
        return cardRepository.createCollectedCard({collector:req.body.me, card:card});
    }).then(function(collectedCard){
        res.json(util.wrapBody(collectedCard));
    }).catch(util.responseInternalError(res));
};

exports.getCollectedCardsByUser = function(req, res){
    cardRepository.getCollectedCardsByUser(req.params.id).then(function(cCards){
        res.json(util.wrapBody(cCards));
    }).catch(util.responseInternalError(res));
};

exports.countCollectedCardsByUser = function(req, res){
    cardRepository.countCollectedCardsByUser(req.params.id).then(function(count){
        res.json(util.wrapBody(count));
    }).catch(util.responseInternalError(res));
};

//test api
exports.listAllCards = function(req, res){
    cardRepository.listAllCards().then(function(cards){
        res.json(util.wrapBody(cards));
    }).catch(util.responseInternalError(res));
};

exports.listAllCollectedCards = function(req, res){
    cardRepository.listAllCollectedCards().then(function(collects){
        res.json(util.wrapBody(collects));
    }).catch(util.responseInternalError(res));
};