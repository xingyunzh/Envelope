/**
 * Created by brillwill on 2016/12/29.
 */
var cardRepository = require("../repositories/cardRepository");
var themeRepository = require("../repositories/themeRepository");
var log = require("../repositories/logRepository");
var util = require("../util/util");
var fs = require("fs");
var q = require("q");

var theSpecificSenderDataPlaceHolder = "'theSpecificSenderDataPlaceHolderToReplace'";
var theMetaDescContentPlaceHolder = "theHeadMetaDescriptionContent";
var theTitlePlaceHolderToReplace = "theTitlePlaceHolderToReplace";

function populateCardHtml(html, card){
    //hijack user icon
    card.sender.headImgUrl = "http://campro.oss-cn-shanghai.aliyuncs.com/Bitmaphead.jpg";

    var theSpecificSenderData = {
        theCard:card
    };

    var cardHtml = html.replace(theMetaDescContentPlaceHolder, card.text);
    cardHtml = cardHtml.replace(theTitlePlaceHolderToReplace, card.sender.nickname + '祝:' + card.theme.title);
    cardHtml = cardHtml.replace(theSpecificSenderDataPlaceHolder, JSON.stringify(theSpecificSenderData));
    return cardHtml;
}

exports.getCardViewByUserId = function(req, res){
    var actions = [];
    actions[0] = q.nfbind(fs.readFile)(__dirname + "/../views/card.html", "utf-8");
    actions[1] = cardRepository.getLatestCardBySender(req.params.id);

    q.all(actions).then(function(dataGroup){
        var cardHtml = dataGroup[0];
        var card = dataGroup[1];
        if(card){
            cardHtml = populateCardHtml(cardHtml, card);
        }

        log.add(log.ActionType.View, req.url, req.token ? req.token.userId : null);
        res.send(cardHtml);
    }).catch(util.responseInternalError(res, function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req.token ? req.token.userId : null);
    }));
};

exports.getCardViewByCardId = function(req, res){
    log.add(log.ActionType.View, req.url, req.token ? req.token.userId : null);

    var actions = [];
    actions[0] = q.nfbind(fs.readFile)(__dirname + "/../views/card.html", "utf-8");
    actions[1] = cardRepository.getCardById(req.params.id);

    q.all(actions).then(function(dataGroup){
        var cardHtml = dataGroup[0];
        var card = dataGroup[1];
        if(card){
            cardHtml = populateCardHtml(cardHtml, card);
        }

        res.send(cardHtml);
    }).catch(util.responseInternalError(res, function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req.token ? req.token.userId : null);
    }));
};

exports.getCardByUserId = function(req, res){
    cardRepository.getLatestCardBySender(req.params.id).then(function(card){
        res.json(util.wrapBody(card));
    }).catch(util.responseInternalError(res));
};

exports.createCard = function(req, res){
    cardRepository.createCard(req.body).then(function (card) {
        res.json(util.wrapBody(card));
        log.add(log.ActionType.Create, null, req.token.userId);
    }).catch(util.responseInternalError(res), function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req.token ? req.token.userId : null);
    });
};

exports.deleteCardById = function(req, res){
    cardRepository.deleteCardById(req.params.id).then(function(card){
        res.json(util.wrapBody(card));
    }).catch(util.responseInternalError(res));
};

exports.getCardById = function(req, res){
    cardRepository.getCardById(req.params.id).then(function(card){
         res.json(util.wrapBody(card));
    }).catch(util.responseInternalError(res));
};

exports.collectCard = function(req, res){
    cardRepository.getLatestCardBySender(req.body.sender).then(function(card){
        return cardRepository.createCollectedCard({collector:req.body.me, card:card});
    }).then(function(collectedCard){
        res.json(util.wrapBody(collectedCard));
        log.add(log.ActionType.Collect, null, req.token.userId);
    }).catch(util.responseInternalError(res, function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req.token ? req.token.userId : null);
    }));
};

exports.getCollectedCardById = function(req, res){
    cardRepository.getCollectedCardById(req.params.id).then(function(card){
        res.json(util.wrapBody(card));
    }).catch(util.responseInternalError(res));
};

exports.deleteCollectedCardById = function(req, res){
    cardRepository.deleteCollectedCardById(req.params.id).then(function(card){
        res.json(util.wrapBody(card));
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

exports.isCardCollected = function(req, res){
    cardRepository.isCardCollected(req.query.me, req.query.card).then(function(collect){
        res.json(util.wrapBody(!!collect));
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