
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
    rootRouter.get('/card/:id', cardController.getCardViewByUserId);

    // body
    //
    // sender:id
    // createDate: Date
    // theme:id
    // text:String
    //
    // return card entity
    rootRouter.post('/card', cardController.createCard);

    // body
    // category:String
    // textCandidates:[String],
    // return themeConfig entity
    rootRouter.post('/tconfig', themeController.createThemeConfig);

    //return theme entity
    rootRouter.get('/tconfig', themeController.getThemeConfig);

    //body
    // category:String
    // name:String,
    //     imageURL:String,
    //     nicknameCSS:String,
    //     headiconCSS:String,
    //     spriteCSS:String
    //return - theme entity
    rootRouter.post('/theme', themeController.createTheme);

    //id - theme id
    //return theme entity
    rootRouter.get('/theme/:id', themeController.getThemeById);

    //get all candidates themes
    //return [theme entity]
    rootRouter.get('/theme', themeController.getCandidateThemes);

    //body params
    //sender:id
    //me:id
    //return collectCard entity
    rootRouter.post('/collect', cardController.collectCard);

    //param id - user id
    //return [cards entity]
    rootRouter.get('/collect/cards/:id', cardController.getCollectedCardsByUser);

    //param id - user id
    //return count:Integer
    rootRouter.get('/collect/count/:id', cardController.countCollectedCardsByUser);

    //param id - card id
    //return card entity
    rootRouter.get('/card/id/:id', cardController.getCardById);
};
