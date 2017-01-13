/**
 * Created by brillwill on 2016/12/29.
 */
var cardRepository = require("../repositories/cardRepository");
var themeRepository = require("../repositories/themeRepository");
var wechatRepository = require("../repositories/wechatRepository");
var log = require("../repositories/logRepository");
var util = require("../util/util");
var fs = require("fs");
var q = require("q");

var theSpecificSenderDataPlaceHolder = "'theSpecificSenderDataPlaceHolderToReplace'";
var theMetaDescContentPlaceHolder = "theHeadMetaDescriptionContent";
var theTitlePlaceHolderToReplace = "theTitlePlaceHolderToReplace";
var theWechatConfigPlaceHolder = "'theWechatConfigPlaceHolder'";

function populateCardHtml(html, card, config){
    //hijack user icon
    //card.sender.headImgUrl = "http://envelope.oss-cn-shanghai.aliyuncs.com/duola.jpg";

    var theSpecificSenderData = {
        theCard:card
    };

    var cardHtml = html.replace(theMetaDescContentPlaceHolder, card.themeConfig.textCandidates[card.textIndex]);
    cardHtml = cardHtml.replace(theTitlePlaceHolderToReplace, card.sender.nickname + '祝福:' + card.theme.title);
    cardHtml = cardHtml.replace(theSpecificSenderDataPlaceHolder, JSON.stringify(theSpecificSenderData));
    cardHtml = cardHtml.replace(theWechatConfigPlaceHolder,JSON.stringify(config));
    return cardHtml;
}

function getCardTemplate(name){
//    if (getCardTemplate.cache.hasOwnProperty(name)) {
//        return q.fcall(function(){
//            return getCardTemplate.cache[name];
//        });
//    }

    return q.nfbind(fs.readFile)(__dirname + "/../views/"+name, "utf-8").then(function(template){
        getCardTemplate.cache[name] = template;
        return template;
    });
}

getCardTemplate.cache = {};

exports.getCardViewByUserId = function (req, res) {
    var card = null;
    cardRepository.getLatestCardBySender(req.params.id).then(function (data) {
        card = data;
        if (!card) {
            throw "Card does not exist!";
        }

        var actions = [
            getCardTemplate(card.theme.cardTemplate),
            wechatRepository.getConfigParams(req.protocol + '://' + req.get('host') + req.originalUrl)
        ];

        return q.all(actions);
    }).then(function (dataGroup) {
        var cardHtml = dataGroup[0];
        var config = dataGroup[1];
        cardHtml = populateCardHtml(cardHtml, card, config);

        log.add(log.ActionType.View, req.url, req);
        res.send(cardHtml);
    }).catch(util.responseInternalError(res, function (error) {
        log.add(log.ActionType.Error, JSON.stringify({url: req.url, err: error}), req);
    }));
};

exports.getCardViewByCardId = function(req, res){
    var card = null;
    cardRepository.getCardById(req.params.id).then(function(data){
        card = data;
        if (!data) {
            throw "Card does not exist!";
        }

        return getCardTemplate(card.theme.cardTemplate);
    }).then(function(template){
        var cardHtml = template;

        log.add(log.ActionType.View, req.url, req);
        res.send(cardHtml);
    }).catch(util.responseInternalError(res, function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req);
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
        log.add(log.ActionType.Create, null, req);
    }).catch(util.responseInternalError(res), function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req);
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
    if(req.body.me == req.body.sender){
        res.json(util.wrapBody("can not collect yourself card", "E"));
        return;
    }

    cardRepository.getLatestCardBySender(req.body.sender).then(function(card){
        return cardRepository.createCollectedCard({collector:req.body.me, card:card});
    }).then(function(collectedCard){
        res.json(util.wrapBody(collectedCard));
        log.add(log.ActionType.Collect, null, req);
    }).catch(util.responseInternalError(res, function(error){
        log.add(log.ActionType.Error, JSON.stringify({url:req.url, err:error}), req);
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