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