
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

    rootRouter.get('/card/:id', cardController.getCardViewByUserId);
    rootRouter.post('/card', cardController.createCard);

    rootRouter.post('/tconfig', themeController.createThemeConfig);
    rootRouter.get('/tconfig', themeController.getThemeConfig);

    rootRouter.post('/theme', themeController.createTheme);
    rootRouter.get('/theme/:id', themeController.getThemeById);
    rootRouter.get('/theme', themeController.getCandidateThemes);
};
