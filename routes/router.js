
var userAPI = require('./userAPI');
var imageAPI = require('./imageAPI');

var rootRouter = require("express").Router();
var systemConfigRouter = require("./systemConfigRouter");

var cardController = require("../controllers/cardController");
var themeController = require("../controllers/themeController");

module.exports = function(app, contextRoot) {
    app.use(contextRoot, rootRouter);

    //Please make any business router under the rootRouter, so that it will be easy for contextRoot config.

    rootRouter.use('/system', systemConfigRouter);

    //rootRouter.use('/api',authenticator.authenticate);

	rootRouter.use('/api/user',userAPI);
    rootRouter.use('/api/image',imageAPI);

    //id - user id
    //main method to render the card view
    rootRouter.get('/api/card/view/user/:id', cardController.getCardViewByUserId);

    //id - card id
    rootRouter.get('/api/card/view/id/:id', cardController.getCardViewByCardId);

    //return json of the card for the user
    rootRouter.get('/api/card/user/:id', cardController.getCardByUserId);

    // body
    //
    // sender:id
    // theme:id
    // text:String
    //
    // return card entity
    rootRouter.post('/api/card/create', cardController.createCard);

    //param id - card id
    //return card entity
    rootRouter.get('/api/card/id/:id', cardController.getCardById);

    //id card
    rootRouter.get('/api/card/delete/:id', cardController.deleteCardById);

    // body
    // category:String
    // textCandidates:[String],
    // return themeConfig entity
    rootRouter.post('/api/tconfig/create', themeController.createThemeConfig);

    // params id - theme config id
    // body: config entity
    // return config enetity
    rootRouter.post('/api/tconfig/id/:id', themeController.updateThemeConfig);

    //return theme entity
    rootRouter.get('/api/tconfig/current', themeController.getThemeConfig);

    rootRouter.get('/api/tconfig/delete/:id', themeController.deleteThemeConfig);

    //body
    // category:String
    // name:String,
    //     imageURL:String,
    //     nicknameCSS:String,
    //     headiconCSS:String,
    //     spriteCSS:String
    //return - theme entity
    rootRouter.post('/api/theme/create', themeController.createTheme);

    //params id - theme id
    //body: content (theme entity)
    //return - theme entity
    rootRouter.post('/api/theme/id/:id', themeController.updateTheme);

    //id - theme id
    //return theme entity
    rootRouter.get('/api/theme/id/:id', themeController.getThemeById);
    rootRouter.get('/api/theme/delete/:id', themeController.deleteTheme);

    //get all candidates themes
    //return [theme entity]
    rootRouter.get('/api/theme', themeController.getCandidateThemes);

    //body params
    //sender:id
    //me:id
    //return collectCard entity
    rootRouter.post('/api/collect', cardController.collectCard);

    //param id - user id
    //return [cards entity]
    rootRouter.get('/api/collect/cards/:id', cardController.getCollectedCardsByUser);

    // id - CollectedCard
    rootRouter.get('/api/collect/delete/:id', cardController.deleteCollectedCardById);

    //param id - user id
    //return count:Integer
    rootRouter.get('/api/collect/count/:id', cardController.countCollectedCardsByUser);

    //query.me
    //query.card
    rootRouter.get('/api/collect/exist', cardController.isCardCollected);

    //console api
    rootRouter.get('/console/themes', themeController.listAllThemes);
    rootRouter.get('/console/themeconfigs', themeController.listAllThemeConfigs);

    
    //for test only
    rootRouter.get('/test/cards', cardController.listAllCards);
    rootRouter.get('/test/collect/cards', cardController.listAllCollectedCards);

};
