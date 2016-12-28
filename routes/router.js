
var userAPI = require('./userAPI');
var imageAPI = require('./imageAPI');

var rootRouter = require("express").Router();
var systemConfigRouter = require("./systemConfigRouter");


module.exports = function(app, contextRoot) {
    app.use(contextRoot, rootRouter);

    //Please make any business router under the rootRouter, so that it will be easy for contextRoot config.

    rootRouter.use('/system', systemConfigRouter);

    //rootRouter.use('/api',authenticator.authenticate);

	rootRouter.use('/api/user',userAPI);
    rootRouter.use('/api/image',imageAPI);

};
