var userController = require('../controllers/userController');
var authenticator = require('../authenticate/authenticator');
var router = require('express').Router();

//body parameters
//	required:
//		code:String
//response:
//{user:UserEntity}
router.post('/login/wechat',userController.loginByWechat);

//body parameters
//	required:
//		email:String
//		password:String
//response:
//{user:UserEntity}
router.post('/login/email',userController.loginByEmail);

//path parameters
//	required:
//		id:String (idea)
//response:
//{user:UserEntity}
router.get('/profile/:id',userController.getProfileById);

//path parameters
//	required:
//		id:String (idea)
//body parameters
//	required:
//	optional:
//		nickName:String
//		roles:[String] (coach/player)
//		sector:String
//		skills:[String]
//		headImgUrl: String
//response:
//{user:UserEntity}
router.post('/profile/update/:id',authenticator.authenticate,userController.update);

//query parameters
//	required:
//	optional:
//		pageNum:Number
//		pageSize:Number
//		keyword:String (for name)
//		role:String (coach/player)
//		sector:String
//response:
//{total:TotalNumber,ideas:[UserEntities]}
router.get('/list',userController.listUser);

module.exports = router;