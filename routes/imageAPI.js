var imageController = require('../controllers/imageController');
var router = require('express').Router();

//body parameters
//	required:
//		url:String
//		type:String (user,idea,team,project,other)
//		name:String
//response:
//{image:ImageEntity}
router.post('/add',imageController.addNewImage);

//body parameters
//	required:
//		id:String
//response:
//{image:ImageEntity}
router.get('/id/:id',imageController.getImageById);

//query parameters
//	required:
//		type:String 
//	optional:
//		pageNum:Number
//		pageSize:Number
//response:
//{total:TotalNumber,ideas:[IdeaEntities]}
router.get('/type/:type',imageController.getImagesByType);

module.exports = router;