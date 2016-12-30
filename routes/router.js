
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
    rootRouter.get('/api/card/:id', cardController.getCardViewByUserId);

    // body
    //
    // sender:id
    // createDate: Date
    // theme:id
    // text:String
    //
    // return card entity
    rootRouter.post('/api/card', cardController.createCard);

    // body
    // category:String
    // textCandidates:[String],
    // return themeConfig entity
    rootRouter.post('/api/tconfig', themeController.createThemeConfig);

    // params id - theme config id
    // body: config entity
    // return config enetity
    rootRouter.post('/api/tconfig/:id', themeController.updateThemeConfig);

    //return theme entity
    rootRouter.get('/api/tconfig', themeController.getThemeConfig);

    //body
    // category:String
    // name:String,
    //     imageURL:String,
    //     nicknameCSS:String,
    //     headiconCSS:String,
    //     spriteCSS:String
    //return - theme entity
    rootRouter.post('/api/theme', themeController.createTheme);

    //params id - theme id
    //body: content (theme entity)
    //return - theme entity
    rootRouter.post('/api/theme/:id', themeController.updateTheme);

    //id - theme id
    //return theme entity
    rootRouter.get('/api/theme/:id', themeController.getThemeById);

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

    //param id - user id
    //return count:Integer
    rootRouter.get('/api/collect/count/:id', cardController.countCollectedCardsByUser);

    //param id - card id
    //return card entity
    rootRouter.get('/api/card/id/:id', cardController.getCardById);
    
    
    //for test only
    rootRouter.get('/test/cards', cardController.listAllCards);
    rootRouter.get('/test/collect/cards', cardController.listAllCollectedCards);
    rootRouter.get('/test/themes', themeController.listAllThemes);
    rootRouter.get('/test/themeconfigs', themeController.listAllThemeConfigs);
};
