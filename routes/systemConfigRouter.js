/**
 * Created by brillwill on 16/10/12.
 */
var systemConfigController = require('../controllers/systemConfigController.js');

var router = require('express').Router();

//router.post('/profile',userController.getProfile);
router.get('/oss', systemConfigController.getOSSConfig);
router.get('/shortid', systemConfigController.getShortID);

module.exports = router;